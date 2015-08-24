"use strict";

import { permit } from 'client/scripts/components/_utils/permit-utility';

let Types = React.PropTypes

export let Permit = React.createClass({

  propTypes: {
    category: Types.string,
    feature: Types.string
  },

  render() {
    if (permit(this.props.category,this.props.feature)) {
      return this.props.children;
    } else {
      return null;
    }
  }
});