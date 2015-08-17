"use strict";

export let Authorize = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    let user = Session.get('currentUser')
    if (!user) {
      App.Utils.AutoLogin();
    }
    return {
      user: user
    }
  },

  render() {
    if (this.data.user) {
      return this.props.children;
    } else {
      return null;
    }
  }
});