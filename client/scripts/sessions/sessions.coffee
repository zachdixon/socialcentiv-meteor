View =
  login: (e, doc) ->
    e.preventDefault()
    node = $(e.currentTarget)
    email = node.find('input[type="email"]').val()
    password = node.find('input[type="password"]').val()
    if email and password
      str = email + ":" + password
      auth_string = btoa(unescape(encodeURIComponent(str)))
      API.sessions.login({auth_string: auth_string}, (err, res) ->
        if err
          # show errors
        else
          Cookie.set('currentUserEmail', res.email)
          Cookie.set('currentUserAuth', res.authentication_token)
          Session.set('currentUser', res)
          Router.go('tweets')
      )


Template.login.events
  'submit form': View.login