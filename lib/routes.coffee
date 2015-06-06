Router.configure
  layoutTemplate: "mainLayout"

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

