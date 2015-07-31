{ ReactRouter } = NpmDependencies

{ Link, Navigation, State, RouteHandler } = ReactRouter

{
  Header,
  Footer
} = App.Components

AppBody = React.createClass
  mixins: [ReactMeteorData, Navigation, State]

  getMeteorData: ->
    user = Session.get('currentUser')
    layout = "sessions"
    if user
      layout = "main"
      if @isActive('login') then @transitionTo('tweets')
    else
      email = Cookie.get('currentUserEmail')
      auth = Cookie.get('currentUserAuth')
      # If cookies exists, login
      if email and auth
        @setState 'loggingIn': true
        callback = (err, res) =>
          if err
            layout = "sessions"
            @transitionTo('login')
            # show errors
          else
            user = res.data
            Cookie.set('currentUserEmail', user.email, {path: "/", domain: App.DOMAIN})
            Cookie.set('currentUserAuth', user.authentication_token, {path: "/", domain: App.DOMAIN})
            Session.set('currentUser', user)
            @setState 'loggingIn': false
        API.sessions.login({auth_type: "token"}, callback.bind(@))
      else
        layout = "sessions"
        @transitionTo 'login'
    
    currentUser: user
    layout: layout

  getInitialState: ->
    loggingIn: false

  render: ->
    if @state.loggingIn
      <div>Replace me with loading screen maybe?</div>
    else
      switch @data.layout
        when "sessions"
          <SessionsLayout />
        when "main"
          <MainLayout />


SessionsLayout = React.createClass
  render: ->
    <div>
      <div id="session-wrapper">
        <div className="session-logo col-xs-12">
          <a href="http://socialcentiv.com">
            <img className="socialcentiv-logo white navbar-brand" src="images/new-logo-blue.png" width="200" />
          </a>
        </div>
        <RouteHandler />
      </div>
      <Footer />
    </div>

MainLayout = React.createClass
  render: ->
    <div id="app-wrapper">
      <Header />
      <div className="container dashboard" id="main-container">
        <div className="row">
          <div className="col-md-12 col-xs-12 page-wrap">
            <div className="main-content">
              <RouteHandler />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

_.extend App.Components, { AppBody }