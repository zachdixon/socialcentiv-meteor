"use strict";

import { ReactOnClickOutside, classNames } from 'app-deps';
import { Link } from 'Link';
import { ShowFor } from 'ShowFor';
import { CONSTANTS } from 'Constants';

let Types = React.PropTypes;
const {BO,IP,AM,ADMIN} = CONSTANTS;

export let Header = React.createClass({
  displayName: "Header",

  render() {
    return (
      <div>
        <ShowFor type={[IP, AM, ADMIN]}>
          <IPHeader/>
        </ShowFor>
      </div>
    )
  }
});

let IPHeader = React.createClass({
  // Figure out a more React way of doing this
  showSubNav() {
    return !_.includes([
        'managedAccounts'
      ], FlowRouter.getRouteName());
  },

  render() {
    let business_id = FlowRouter.getParam('id');
    let routes = {
          primary: [
            {id: 1, name: "Accounts", to: "managedAccounts"}
          ],
          secondary: [
            {id: 1, name: "Tweets", to: "accountTweets", params: {id: business_id}}
          ]
        };
    return (
      <div>
        <PrimaryNav routes={routes.primary} />
        {this.showSubNav()?
          <SecondaryNav routes={routes.secondary} />
        : null}
      </div>
    )
  }
});

let PrimaryNav = React.createClass({
  displayName: "PrimaryNav",
  
  propTypes: {
    routes: Types.array
  },

  render() {
    return (
      <div className="main-nav-wrapper">
        <div className="container">
          <div className="row">
            <a>
              <div className="logo">
                <img alt="socialcentiv logo" className="logo-img" src="/images/new-logo.png" />
              </div>
            </a>
            <nav>
              <ul id="main-nav">
                {this.props.routes.map(route => {
                  return (
                    <li key={route.id} className="main-nav-item">
                      <Link className='main-nav-link' to={route.to || FlowRouter.path(route.name)} params={route.params}>
                        <span className="label">{route.name.toUpperCase()}</span>
                      </Link>
                    </li>
                  );
                })}
                <MainUtilityNav />
              </ul>
            </nav>
          </div>
        </div>
      </div>
    )
  }
});

let SecondaryNav = React.createClass({
  displayName: "SecondaryNav",

  propTypes: {
    routes: Types.array
  },

  render() {
    return (
      <div className="secondary-nav-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="secondary-nav">
                <ul>
                  {this.props.routes.map(route => {
                    return (
                      <li key={route.id} className="secondary-nav-item">
                        <Link className='secondary-nav-link' to={route.to || FlowRouter.path(route.name)} params={route.params}>
                          <span className="label">{route.name.toUpperCase()}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

let MainUtilityNav = React.createClass({
  displayName: "MainUtilityNav",
  mixins: [ReactMeteorData, ReactOnClickOutside],

  getInitialState() {
    return {
      open: false
    }
  },

  getMeteorData() {
    return {
      user: Session.get('currentUser')
    }
  },

  toggle(e) {
    e? e.preventDefault() : null;

    return this.setState({open: !this.state.open});
  },

  handleClickOutside(e) {
    if (this.state.open) this.toggle();
  },

  handleLogout(e) {
    // Clear cookies
    App.clearCurrentUserCookies();
    App.clearAdvancedUserCookies();
    App.clearSession();
    App.clearData();
  },

  render() {
    return (
      <li className="main-nav-item pull-right dropdown-nav">
        <Link className="main-nav-link sub-nav-toggle" to="" onClick={this.toggle} style={{"paddingLeft": "15px !important"}}>
          <span className="main-nav-icon glyphicon glyphicon-user" style={{"marginRight": "15px"}}></span>
          <span className="label">{this.data.user? this.data.user.name || this.data.user.email : ""}</span>
        </Link>
        <ul className="sub-nav" style={{display: this.state.open? 'block' : 'none'}}>
          {/* Implement later for user's account settings */}
          {/*<li className="sub-nav-item">
            <Link className="sub-nav-link" to="/account">
              <span className="glyphicon glyphicon-user main-nav-icon"></span>
              <span className="label">My Account</span>
            </Link>
          </li>*/}
          <li className="sub-nav-item">
            <Link className="sub-nav-link link-logout" to="" onClick={this.handleLogout}>
              <span className="glyphicon glyphicon-log-out main-nav-icon"></span>
              <span className="label">Log Out</span>
            </Link>
          </li>
        </ul>
      </li>
    )
  }
});