"use strict";

let {
  element
} = React.PropTypes;

export let MainLayout = React.createClass({
  displayName: "MainLayout",

  mixins: [ReactMeteorData],

  propTypes: {
    content: element.isRequired
  },

  getMeteorData() {

    return {
      currentUser: Session.get('currentUser')
    };
  },

  render() {
    /* Render layout here */
    return (
      <div id="app-wrapper">
        <div className="main-content">
          {this.props.content}
        </div>
      </div>
    );
  }
});