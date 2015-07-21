{classNames, MUI} = NpmDependencies

{
  TextField
} = MUI

Login = React.createClass
  childContextTypes:
    muiTheme: React.PropTypes.object

  getChildContext: ->
    muiTheme: App.ThemeManager.getCurrentTheme()

  render: ->
    <form className="col-xs-12">
      <div className="row">
        <ul className="errors col-xs-12">
          <li className="error">
            <p data-foreach-error="session.errors" data-source="error.message"></p>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="form-group col-xs-12">
          <input autoComplete="off" className="form-control" placeholder="Email" required="" type="email" />
        </div>
        <div className="form-group col-xs-12">
          <input autoComplete="off" className="form-control" placeholder="Password" required="" type="password" />
        </div>
      </div>
      <div className="row">
        <div className="session-submit col-xs-12 text-align-center">
          <button className="btn btn-blue ladda-button" data-style="zoom-in" type="submit"><span className="ladda-label">Log In</span></button>
        </div>
      </div>
      <div className="row">
        <div className="session-actions col-xs-12">
          <a className="btn-forgot-password" href="">Forgot your password?</a><a className="btn-create-account" href="http://www.socialcentiv.com/signup">Create an account</a>
        </div>
      </div>
    </form>


_.extend App.Components, {Login}