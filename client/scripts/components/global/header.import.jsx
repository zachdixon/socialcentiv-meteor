"use strict";

import { ReactOnClickOutside, classNames } from 'app-deps';
import { Link } from 'client/scripts/components/global/link';
import { ShowFor } from 'client/scripts/components/_utils/show-for';
import { CONSTANTS } from 'client/scripts/constants';

let Types = React.PropTypes;

export let Header = React.createClass({
  displayName: "Header",

  // Figure out a more React way of doing this
  // Tried passing a prop but the prop stayed the same on re-render
  showSubNav() {
    return !_.includes([
        'managedAccounts'
      ], FlowRouter.getRouteName());
  },

  render() {
    let account_routes = [
          {id: 1, name: "tweets"}
          // {id: 2, name: "campaigns"}
          // {id: 3, name: "reports"}
        ],
        managed_routes = [
          {id: 1, name: "accounts", url: "/managed/accounts"}
        ];
    return (
      <div>
        <ShowFor type={CONSTANTS.BO}>
          <PrimaryNav routes={account_routes} />
        </ShowFor>
        <ShowFor type={[CONSTANTS.IP, CONSTANTS.AM, CONSTANTS.ADMIN]}>
          <div>
            <PrimaryNav routes={managed_routes} />
            {this.showSubNav()?
              <SecondaryNav routes={account_routes} />
            : null}
          </div>
        </ShowFor>
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
                      <Link className='main-nav-link' to={route.url || FlowRouter.path(route.name)}>
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
                        <Link className='secondary-nav-link' to={route.url || FlowRouter.path(route.name)}>
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

  getMeteorData() {
    return {
      business: Session.get('business')
    }
  },

  getInitialState() {
    return {
      open: false
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
    Cookie.remove('currentUserEmail', {path: '/', domain: App.DOMAIN});
    Cookie.remove('currentUserAuth', {path: '/', domain: App.DOMAIN});
    // Clear session variables
    Object.keys(Session.keys).forEach((key) => {
      return Session.set(key, undefined);
    });

    // Clearing currentUser should stop observers, but just in case
    // Clear local collections
    Object.keys(App.Collections).forEach((k) => {
      var o = App.Collections;
      o[k].observer? o[k].observer.stop() : null;
      return o[k].remove({});
    });
  },

  render() {
    let business = this.data.business;
    return (
      <li className="main-nav-item pull-right dropdown-nav">
        <Link className="main-nav-link sub-nav-toggle" to="" onClick={this.toggle}>
          {(() => {
            if(business && business.status == "active") {
              return (
                <span className="account-logo-wrapper">
                  <img className="account-logo" src={business.twitter_avatar_url}/>
                </span>
              );
            }
          })()}
          <span className="label">{business? business.name : ""}</span>
        </Link>
        <ul className="sub-nav" style={{display: this.state.open? 'block' : 'none'}}>
          <li className="sub-nav-item">
            <Link className="sub-nav-link" to="/account">
              <span className="glyphicon glyphicon-user main-nav-icon"></span>
              <span className="label">My Account</span>
            </Link>
          </li>
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