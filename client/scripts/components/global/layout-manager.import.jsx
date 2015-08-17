"use strict";

import { permit } from 'client/scripts/components/_utils/permit-utility';

let Types = React.PropTypes;

export let LayoutManager = React.createClass({

  mixins: [ReactMeteorData],

  propTypes: {
    layout: Types.func.isRequired,
    content: Types.element.isRequired,
    properties: Types.object
  },

  getMeteorData() {
    return {
      currentUser: Session.get('currentUser')
    };
  },

  componentWillMount() {
    // Checks permission for current route
    if (this.data.currentUser && !permit('routes', FlowRouter.current().route.name)) {
      FlowRouter.go('tweets');
    };
  },

  render() {
    let properties = _.assign({content: this.props.content},this.props.properties);
    let el = React.createElement(this.props.layout, properties);
    return el;
  }
});
