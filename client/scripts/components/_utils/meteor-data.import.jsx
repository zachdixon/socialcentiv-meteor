"use strict";

// NOTE - contexts weren't working, need to upgrade react package but ran into dependency errors; deal with it later

export let MeteorData = React.createClass({
  // childContextTypes: {
  //   data: React.PropTypes.object
  // },
  componentWillMount() {
    this.tracker = Tracker.autorun(() => {
      let state = this.props.getMeteorData();
      this.setState(state);
    });
  },
  componentWillUnmount() {
    this.tracker.stop();
  },
  // getChildContext() {
  //   return {
  //     data: this.state || {}
  //   }
  // },
  render() {
    return this.state? React.addons.cloneWithProps(this.props.children, {data: this.state}) : false
  }
});
