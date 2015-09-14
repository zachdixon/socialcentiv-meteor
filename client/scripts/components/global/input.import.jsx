"use strict";

export let Input = React.createClass({

  propTypes: {
    cancelable: React.PropTypes.bool,
    wrapperClass: React.PropTypes.string,
    onCancel: React.PropTypes.func
  },

  render() {
    if (this.props.cancelable) {
      let className = " clearfix input-wrapper cancelable";
      if (this.props.wrapperClass) {
        className = this.props.wrapperClass.concat(className);
      }
      return (
        <form className={className}>
          <input ref="input" {...this.props} required/>
          <button className="cancelable-button"
                  type="reset"
                  onClick={this.props.onCancel}>
          X
          </button>
        </form>
      )
    } else {
      return <input {...this.props} />;
    }
  }
});