AutoLogin = ->
  user = Session.get('currentUser')
  if user
    user.account_type = "InteractiveProducer"
    Session.set('currentUser', user) # FIXME - remove once server returns account_type
    if FlowRouter.getRouteName() is 'login' then FlowRouter.go('tweets')
  else
    email = Cookie.get('currentUserEmail')
    auth = Cookie.get('currentUserAuth')
    # If cookies exists, login
    if email and auth
      callback = (err, res) =>
        if err
          FlowRouter.go('login')
          # show errors
        else
          user = res.data
          Cookie.set('currentUserEmail', user.email, {path: "/", domain: App.DOMAIN})
          Cookie.set('currentUserAuth', user.authentication_token, {path: "/", domain: App.DOMAIN})
          user.account_type = "InteractiveProducer"
          Session.set('currentUser', user)
      API.sessions.login({auth_type: "token"}, callback.bind(@))
    else
      FlowRouter.go 'login'

_.extend App.Utils, { AutoLogin }
