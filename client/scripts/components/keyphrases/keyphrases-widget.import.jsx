"use strict";

import { classNames } from 'app-deps';

let {string, array, object, bool, arrayOf} = React.PropTypes;

/*
  Keyphrases widget used on the left sidebar of the Tweets page
  components: KeyphrasesList
*/
export let KeyphrasesWidget = React.createClass({
  displayName: "KeyphrasesWidget",

  mixins: [ReactMeteorData],

  getMeteorData() {

    return {
      positiveKeyphrases: Keyphrases.find({action_type: "pump"}).fetch(),
      NegativeKeyphrases: Keyphrases.find({action_type: "filter"}).fetch()
    };
  },
  
  render() {
    return (
      <div id="keywordphrases">
        <KeyphrasesList type="positive" keyphrases={this.data.positiveKeyphrases} />
        <hr />
        <KeyphrasesList type="negative" keyphrases={this.data.negativeKeyphrases} />
      </div>
    )
  }
});


/*
  List of keyphrases
  components: Keyphrase
*/
let KeyphrasesList = React.createClass({
  displayName: "KeyphrasesList",

  propTypes: {
    type: string.isRequired,
    keyphrases: arrayOf(object)
  },
  
  render() {
    return (
      <div className="positive-keyphrases">
        <div className="tips">
          <a className="btn-manage-keywords" href="">Edit</a>
          <div className="label">
            {(() => {
              if (this.props.type == "positive") {
                return "KEYPHRASES";
              } else {
                return "EXCLUDE THESE KEYPHRASES";
              }
            })()}
          </div>
        </div>
        {(() => {
          let keyphrases = this.props.keyphrases;
          if (keyphrases && keyphrases.length) {
            this.props.keyphrases.map((keyphrase) => {
              return (
                <Keyphrase key={keyphrase.id} type={this.props.type} keyphrase={keyphrase} />
              );
            });
          }
        })()}
      </div>
    );
  }
});


/*
  Single Keyphrase
*/
export let Keyphrase = React.createClass({
  displayName: "Keyphrase",

  propTypes: {
    type: string.isRequired,
    keyphrase: object.isRequired,
    showDelete: bool
  },

  getInitialState() {
    return {
      is_open: false
    };
  },

  render() {
    if (this.props.type == "positive") {
      return (
        <div className="keyphrase">
          <div className={classNames("keyword-details", {"open": this.state.is_open})}>
            <span className={classNames("chevron", "glyphicon", {"glyphicon-chevron-up": this.state.is_open}, {"glyphicon-chevron-down": !this.state.is_open})}></span>
            <span className="phrase" title={this.props.keyphrase.phrase}>{this.props.keyphrase.phrase}</span>
            <span className="hide-tweets">HIDE TWEETS</span>
            {
              this.props.showDelete? (
                <span className="btn glyphicon-trash glyphicon"></span>
              ) : null
            }
          </div>
          <div className="keyword-performance-indicators">
            <ul className="indicators">
              <li className="conversion_rate">
                <span className="context">Conversion Rate</span>
                <span className="perc">%</span>
                <span className="value">{this.props.keyphrase.conversion_rate}</span>
              </li>
              <li className="click_thru_rate" style={{display: "none !important"}}>
                <span className="context">Click-thru Rate</span>
                <span className="perc">%</span>
                <span className="value">{this.props.keyphrase.click_thru_rate}</span>
              </li>
              <li className="replied_to">
                <span className="context">Replied Tweets</span>
                <span className="value">{this.props.keyphrase.replied_to_conversations_count}</span>
              </li>
              <li className="deleted">
                <span className="context">Deleted Tweets</span>
                <span className="value">{this.props.keyphrase.deleted_conversations_count}</span>
              </li>
              <li className="new_customers">
                <span className="context">New Customers</span>
                <span className="value">{this.props.keyphrase.conversions}</span>
              </li>
              <li className="tweets_with_keyword">
                <span className="context">Tweets with this keyword</span>
                <span className="value">{this.props.keyphrase.pending_conversations_count}</span>
              </li>
            </ul>
          </div>
        </div>
      )
    } else if (this.props.type == "negative") {
      return (
        <div className="keyphrase">
          <div className="keyword-details less">
            <span className="phrase">{this.props.keyphrase.phrase}</span>
          </div>
        </div>
      )
    }
  }
});