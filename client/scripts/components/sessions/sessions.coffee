View =
  login: (e, doc) ->
    e.preventDefault()
    node = $(e.currentTarget)
    email = node.find('input[type="email"]').val()
    password = node.find('input[type="password"]').val()
    if email and password
      str = email + ":" + password
      auth_string = btoa(unescape(encodeURIComponent(str)))
      API.sessions.login({auth_type: "basic", auth_string: auth_string}, (err, res) ->
        if err
          # show errors
        else
          user = res.data
          Cookie.set('currentUserEmail', user.email, {path: "/", domain: App.DOMAIN})
          Cookie.set('currentUserAuth', user.authentication_token, {path: "/", domain: App.DOMAIN})
          Session.set('currentUser', user)
          Router.go('tweets')
      )


Template.login.events
  'submit form': View.login