# Meteor.startup ->  
#   Router.configure
#     layoutTemplate: "mainLayout"

#   Router.onBeforeAction ->
#     # If user already exists, continue
#     if Session.get('currentUser')
#       @next()
#     # Else check for cookies from previous session
#     else
#       email = Cookie.get('currentUserEmail')
#       auth = Cookie.get('currentUserAuth')
#       # If cookies exists, login
#       if email and auth
#         next = @next
#         callback = (err, res) ->
#           if err
#             Router.go('login')
#             # show errors
#           else
#             user = res.data
#             Cookie.set('currentUserEmail', user.email, {path: "/", domain: App.DOMAIN})
#             Cookie.set('currentUserAuth', user.authentication_token, {path: "/", domain: App.DOMAIN})
#             Session.set('currentUser', user)
#             currentRoute = Router.current().route.getName()
#             if currentRoute is 'login'
#               Router.go('tweets')
#             else
#               # FIXME - figure out 'this' context
#               console.log next
#               next()
#         API.sessions.login({auth_type: "token"}, callback)
#       # cookies don't exists, continue and let other before action reroute to login
#       # NOTE: Doesn't redirect to login to prevent infinite loop
#       else
#         @next()

#   # Redirect to login if no current user
#   # Call @next() in callback of logging in
#   Router.onBeforeAction ->
#     if Session.get('currentUser')
#       @next()
#     else
#       Router.go('login')
#   ,
#     except: ['login']

#   Router.route '/login',
#     name: 'login',
#     layoutTemplate: 'sessionsLayout'

#   Router.route '/',
#     name: 'tweets'
#     template: "tweetsIndex"

#   Router.route '/campaigns',
#     name: 'campaigns'
#     template: "campaignsIndex"

#   Router.route '/reports',
#     name: 'reports'
#     template: "reportsShow"

