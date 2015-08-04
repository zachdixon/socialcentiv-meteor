"use strict";

import {classNames} from 'app-deps';

let {string, array, func} = React.PropTypes;

export let SuggestedResponses = React.createClass({
  displayName: "SuggestedResponses",
  mixins: [ReactMeteorData],
  
  propTypes: {
    responses: array.isRequired,
    onCategoryClick: func.isRequired
  },

  getMeteorData() {
    let local = localStorage.getItem('suggestionsOpen'),
        open;
    if(typeof local !== "undefined" && local !== null) {
      open = (local == 'true');
    } else {
      true
    };
    Session.setDefault('suggestionsOpen', open)

    return {
      open: Session.get('suggestionsOpen')
    }
  },

  toggleSuggestions(e) {
    let open = this.data.open;

    $(React.findDOMNode(this.refs.suggestions)).slideToggle(400);
    
    // unless open
    //   this.getCategoryResponses('invite')

    localStorage.setItem('suggestionsOpen', !open);
    Session.set('suggestionsOpen', !open);
  },

  render() {
    let header_text, button_text;

    header_text = this.data.open? "Choose a Category for Suggested Replies" : "Not Sure What To Say? Try a Suggested Reply";
    button_text = this.data.open? "Hide Suggestions" : "Show Suggestions";

    return (
      <div className={classNames('suggested-replies', {'showing-suggestions': this.data.open})}>
        <div className="try-suggestions clearfix">
          <p className="suggestions-header">{header_text}</p>
          <span className="show-suggestions" onClick={this.toggleSuggestions}>{button_text}</span>
        </div>
        <div className="suggestions clearfix" ref="suggestions">
          <ul>
            {
              this.props.responses.map((responses) => {
                return (
                  <SuggestedResponseCategory key={responses.id} category={responses.category} responses={responses.responses} onClick={this.props.onCategoryClick} />
                )
              })
            }
          </ul>
          <div className="sc-tooltip suggestions-help">
            <span className="glyphicon glyphicon-info-sign"></span>
            <span className="sc-tooltip-content">More info</span>
          </div>
          <a className="see-next" href="#">See Next Suggestion<span className="glyphicon glyphicon-chevron-right"></span></a>
        </div>
      </div>
    )
  }
});

let SuggestedResponseCategory = React.createClass({
  displayName: "SuggestedResponseCategory",
  propTypes: {
    category: string.isRequired,
    responses: array.isRequired,
    onClick: func.isRequired
  },

  getInitialState() {
    let response = this.props.responses? this.props.responses[Math.floor((Math.random() * this.props.responses.length))] : null;

    return {
      random_response: response
    }
  },

  render() {
    return (
      <li className="sc-tooltip" onClick={this.props.onClick.bind(null, this.props.responses)}>
        {this.props.category}
        <span className="sc-tooltip-content">
          {this.state.random_response}
        </span>
      </li>
    )
  }
});
