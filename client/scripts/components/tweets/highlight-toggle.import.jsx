"use strict";


export let HighlightToggle = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    let keywordHighlightOn = Session.get('keyword-highlight-on');
    if (keywordHighlightOn === undefined) {
      let state = localStorage.getItem('keywordHighlightOn');
      if (state !== null) {
        Session.setDefault('keyword-highlight-on', state === "true");
      } else {
        Session.setDefault('keyword-highlight-on', true);
      }
    }
    return {
      keywordHighlightOn: Session.get('keyword-highlight-on')
    }
  },
  handleSwitchChange(e) {
    let pref = this.data.keywordHighlightOn;
    Session.set('keyword-highlight-on', !pref);
    localStorage.setItem('keywordHighlightOn', !pref);
  },

  render() {
    return (
      <div>
        <div className="highlight-keywords clearfix">
          <label htmlFor="keyword-highlight-toggle">Highlight Keywords</label>
          <div className="on-off-switch pull-right">
            <input className="on-off-switch-checkbox"
                   id="keyword-highlight-toggle"
                   name="keyword-highlight-toggle"
                   type="checkbox"
                   checked={this.data.keywordHighlightOn}
                   onChange={this.handleSwitchChange}>
              <label className="on-off-switch-label" htmlFor="keyword-highlight-toggle">
                <span className="on-off-switch-inner"></span>
                <span className="on-off-switch-switch"></span>
              </label>
            </input>
          </div>
        </div>
        <hr/>
      </div>
    )
  }
});