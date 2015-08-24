"use strict";

import { Authorize } from 'Authorize';
import { Header } from 'client/scripts/components/global/header';
import { Footer } from 'client/scripts/components/global/footer';

let Types = React.PropTypes;

export let SessionsLayout =  React.createClass({
  displayName: "SessionsLayout",

  propTypes: {
    content: Types.element.isRequired
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

  propTypes: {
    content: Types.element.isRequired,
  },

  render() {
    return (
      <Authorize>
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
      </Authorize>
    );
  }
});