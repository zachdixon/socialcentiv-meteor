"use strict";

import { Header } from 'client/scripts/components/global/header';
import { Footer } from 'client/scripts/components/global/footer';

let {
  element
} = React.PropTypes;

export let SessionsLayout =  React.createClass({
  displayName: "SessionsLayout",

  mixins: [ReactMeteorData],

  propTypes: {
    content: element.isRequired
  },

  getMeteorData() {
    App.Utils.AutoLogin();

    return {
      currentUser: Session.get('currentUser')
    };
  },

  render() {
    return (
      <div>
        <div id="session-wrapper">
          <div className="session-logo col-xs-12">
            <a href="http://socialcentiv.com">
              <img className="socialcentiv-logo white navbar-brand" src="images/new-logo-blue.png" width="200" />
            </a>
          </div>
          {this.props.content}
        </div>
        <Footer />
      </div>
    );
  }
});

export let MainLayout = React.createClass({
  displayName: "MainLayout",

  mixins: [ReactMeteorData],

  propTypes: {
    content: element.isRequired
  },

  getMeteorData() {
    App.Utils.AutoLogin();

    return {
      currentUser: Session.get('currentUser')
    };
  },

  render() {
    return (
      <div id="app-wrapper">
        <Header />
        <div className="container dashboard" id="main-container">
          <div className="row">
            <div className="col-md-12 col-xs-12 page-wrap">
              <div className="main-content">
                {this.props.content}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});