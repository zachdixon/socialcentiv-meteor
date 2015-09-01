AutoLogin = ->
  user = Session.get('currentUser')
  if user
    # user.type = "InteractiveProducer"
    # Session.set('currentUser', user) # FIXME - remove once server returns type
    if FlowRouter.getRouteName() is 'login'
      if user.type is "BusinessOwner"
        FlowRouter.go('tweets')
      else
        FlowRouter.go('managedAccounts')
  else
    # Check for advanced user cookies first, if they exist we want to use them
    email = Cookie.get('advancedUserEmail') or Cookie.get('currentUserEmail')
    auth = Cookie.get('advancedUserAuth') or Cookie.get('currentUserAuth')
    # If cookies exists, login
    if email and auth
      callback = (err, res) =>
        if err
          FlowRouter.go('login')
          # show errors
        else
          user = res.data
          # user.type = "InteractiveProducer"

          if user.type is "BusinessOwner"
            App.setCurrentUserCookies(user.email, user.authentication_token)
          else
            App.setAdvancedUserCookies(user.email, user.authentication_token)

          Session.set('currentUser', user)
      API.sessions.login({auth_type: "token"}, callback.bind(@))
    else
      FlowRouter.go 'login'

_.extend App.Utils, { AutoLogin }
