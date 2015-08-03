{
  element
} = React.PropTypes

SessionsLayout = React.createClass

  mixins: [ReactMeteorData]

  getMeteorData: ->
    App.Utils.AutoLogin()

    currentUser: Session.get('currentUser')

  propTypes:
    content: element

  render: ->
    {
      Header,
      Footer
    } = App.Components
    
    <div>
      <div id="session-wrapper">
        <div className="session-logo col-xs-12">
          <a href="http://socialcentiv.com">
            <img className="socialcentiv-logo white navbar-brand" src="images/new-logo-blue.png" width="200" />
          </a>
        </div>
        {@props.content}
      </div>
      <Footer />
    </div>

MainLayout = React.createClass

  mixins: [ReactMeteorData]

  getMeteorData: ->
    App.Utils.AutoLogin()

    currentUser: Session.get('currentUser')

  propTypes:
    content: element

  render: ->
    {
      Header,
      Footer
    } = App.Components
    
    <div id="app-wrapper">
      <Header />
      <div className="container dashboard" id="main-container">
        <div className="row">
          <div className="col-md-12 col-xs-12 page-wrap">
            <div className="main-content">
              {@props.content}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

_.extend App.Layouts, { SessionsLayout, MainLayout }