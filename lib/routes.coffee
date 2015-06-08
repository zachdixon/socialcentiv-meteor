# if Meteor.isClient
#   Meteor.startup ->
#     email = Cookie.get('currentUserEmail')
#     auth = Cookie.get('currentUserAuth')
#     if email and auth
#       _this = @
#       API.sessions.login({auth_type: "token"}, (err, res) ->
#         if err
#           # show errors
#         else
#           Cookie.set('currentUserEmail', res.email, {path: "/", domain: App.DOMAIN})
#           Cookie.set('currentUserAuth', res.authentication_token, {path: "/", domain: App.DOMAIN})
#           Session.set('currentUser', res)
#           Router.go('tweets')
#       )

Router.configure
  layoutTemplate: "mainLayout"

Router.onBeforeAction ->
  if Session.get('currentUser')
    @next()
  else
    email = Cookie.get('currentUserEmail')
    auth = Cookie.get('currentUserAuth')
    if email and auth
      API.sessions.login({auth_type: "token"}, (err, res) ->
        if err
          Router.go('login')
          # show errors
        else
          Cookie.set('currentUserEmail', res.email, {path: "/", domain: App.DOMAIN})
          Cookie.set('currentUserAuth', res.authentication_token, {path: "/", domain: App.DOMAIN})
          Session.set('currentUser', res)
          Router.go('tweets')
      )
    else
      @next()

# Redirect to login if no current user
# TODO: Check for cookies and automatically login before redirect
# Call @next() in callback of logging in
Router.onBeforeAction ->
  if Session.get('currentUser')
    @next()
  else
    Router.go('login')
,
  except: ['login']

Router.route '/login',
  name: 'login',
  layoutTemplate: 'sessionsLayout'

Router.route '/',
  fastRender: true
  name: 'tweets'
  template: "tweetsIndex"

