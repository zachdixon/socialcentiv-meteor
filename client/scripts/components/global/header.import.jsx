"use strict";

import { ReactOnClickOutside, classNames } from 'app-deps';

let {string} = React.PropTypes;

export let Header = React.createClass({
  displayName: "Header",
  render() {
    return (
      <div className="main-nav-wrapper">
        <div className="container">
          <div className="row">
            <a>
              <div className="logo col-md-2 col-sm-2 col-xs-2">
                <img alt="socialcentiv logo" className="logo-img" src="images/new-logo.png" />
              </div>
            </a>
            <MainNav/>
          </div>
        </div>
      </div>
    );
  }
});

let MainNav = React.createClass({
  displayName: "MainNav",
  routes: [
    {id: 1, name: "tweets", iconSrc: "images/Twitter_logo_white.png"}
    // {id: 2, name: "campaigns", iconClass: "ss-bullseye main-nav-icon"}
    // {id: 3, name: "reports", iconClass: "icon-pie main-nav-icon"}
  ],

  render() {
    return (
      <nav>
        <a className="main-nav-menu" href="#"><span className="glyphicon glyphicon-th"></span></a>
        <ul id="main-nav">
          <a className="close-mobile-menu" href="#"><span className="glyphicon glyphicon-remove"></span></a>
          {this.routes.map(route => {
            return (
              <MainNavItem key={route.id} name={route.name} iconSrc={route.iconSrc} iconClass={route.iconClass} />
            );
          })}
          <MainUtilityNav />
        </ul>
      </nav>
    )
  }
});


let MainNavItem = React.createClass({
  displayName: "MainNavItem",
  propTypes: {
    name: string,
    iconSrc: string,
    iconClass: string
  },
  
  render() {
    return (
      <li className="main-nav-item">
        <a className='main-nav-link' href={FlowRouter.path(this.props.name)}>
          {
            this.props.iconSrc? (
              <img className="smallimg main-nav-icon" src={this.props.iconSrc} />
            ) : (
              <span className={this.props.iconClass}></span>
            )
          }
          <span className="label">{this.props.name.toUpperCase()}</span>
        </a>
      </li>
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
        <a className="main-nav-link sub-nav-toggle" href="" onClick={this.toggle}>
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
        </a>
        <ul className="sub-nav" style={{display: this.state.open? 'block' : 'none'}}>
          <li className="sub-nav-item">
            <a className="sub-nav-link" href="/account">
              <span className="glyphicon glyphicon-user main-nav-icon"></span>
              <span className="label">My Account</span>
            </a>
          </li>
          <li className="sub-nav-item">
            <a className="sub-nav-link link-logout" href="" onClick={this.handleLogout}>
              <span className="glyphicon glyphicon-log-out main-nav-icon"></span>
              <span className="label">Log Out</span>
            </a>
          </li>
        </ul>
      </li>
    )
  }
});