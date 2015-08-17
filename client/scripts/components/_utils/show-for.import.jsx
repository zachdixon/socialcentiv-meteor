"use strict";

import { CONSTANTS } from 'client/scripts/constants';

export let ShowFor = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    accountType: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ])
  },

  getMeteorData() {
    return {
      user: Session.get('currentUser')
    }
  },

  isValid() {
    let type = this.props.accountType;
    if (this.data.user) {
      if (type instanceof Array) {
        return !!_.include(type, this.data.user.account_type);
      } else if (typeof(type) === "string") {
        return type === this.data.user.account_type;
      } else {
        return false;
      } 
    } else {
      return false;
    }
  },

  render() {
    if (this.isValid()) {
      return this.props.children;
    } else {
      return null;
    }
  }
});