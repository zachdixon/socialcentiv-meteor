"use strict";

import { permit } from 'client/scripts/components/_utils/permit-utility';
import { CONSTANTS } from 'client/scripts/constants';

let {BO,IP,AM,ADMIN} = CONSTANTS;
let Types = React.PropTypes;

export let LayoutManager = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    layout: Types.func.isRequired,
    content: Types.element.isRequired,
    properties: Types.object
  },

  getMeteorData() {
    let user = Session.get('currentUser');
    // Checks permission for current route
    if (user && !permit('routes', FlowRouter.current().route.name)) {
      if (user.type === IP) {
        FlowRouter.go('managedAccounts');
      } else {
        FlowRouter.go('tweets');
      }
    };

    return {
      user: user
    };
  },

  render() {
    let properties = _.assign({content: this.props.content},this.props.properties);
    let el = React.createElement(this.props.layout, properties);
    return el;
  }
});
