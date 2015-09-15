AutoLogin = ->
  user = Session.get('currentUser')
  if user
    if FlowRouter.getRouteName() is 'login'
      FlowRouter.go('managedAccounts')
  else
    email = Cookie.get('advancedUserEmail')
    auth = Cookie.get('advancedUserAuth')
    # If cookies exists, login
    if email and auth
      API.sessions.login {auth_type: "token"},
        error: (xhr, textStatus, error) =>
          FlowRouter.go('login')
          # show errors
        success: (data, responseText, xhr) =>
          user = data
          App.setAdvancedUserCookies(user.email, user.authentication_token)
          Session.set('currentUser', user)
    else
      FlowRouter.go 'login'

_.extend App.Utils, { AutoLogin }
