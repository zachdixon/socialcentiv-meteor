"use strict";

import { CONSTANTS } from 'Constants';

let {BO, IP} = CONSTANTS;

export let LoginPage = React.createClass({
  displayName: "LoginPage",
  login(e) {
    e.preventDefault()
    let _this = this,
        email = React.findDOMNode(this.refs.email).value,
        password = React.findDOMNode(this.refs.password).value;
    if (email && password) {
      let str = email + ":" + password,
          auth_string = btoa(unescape(encodeURIComponent(str)));
      API.sessions.login({auth_type: "basic", auth_string: auth_string},
        {
          success: (data, statusText) => {
            let user = data;
            App.setAdvancedUserCookies(user.email, user.authentication_token);
            Session.set('currentUser', user);
            FlowRouter.go('managedAccounts');
        }
      });
    }
  },

  render() {
    return (
      <form className="col-xs-12" onSubmit={this.login}>
        <div className="row">
          <ul className="errors col-xs-12">
            <li className="error">
              <p data-foreach-error="session.errors" data-source="error.message"></p>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="form-group col-xs-12">
            <input className="form-control" placeholder="Email" required="" type="email" ref="email" />
          </div>
          <div className="form-group col-xs-12">
            <input className="form-control" placeholder="Password" required="" type="password" ref="password" />
          </div>
        </div>
        <div className="row">
          <div className="session-submit col-xs-12">
            <button className="btn btn-blue pull-right ladda-button" data-style="zoom-in" type="submit"><span className="ladda-label">Log In</span></button>
          </div>
        </div>
        <div className="row">
          <div className="session-actions col-xs-12">
            <a className="btn-forgot-password" href="">Forgot your password?</a><a className="btn-create-account" href="http://www.socialcentiv.com/signup">Create an account</a>
          </div>
        </div>
      </form>
    )
  }
});