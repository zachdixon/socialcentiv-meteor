"use strict";

import { classNames } from 'app-deps';

export let CampaignsWidget = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      campaigns: Campaigns.find({status: "active"}).fetch()
    }
  },

  render() {
    return (
      <div>
        <div className="tips">
          <div className="label">
            CAMPAIGNS
          </div>
        </div>
        {this.data.campaigns?
          this.data.campaigns.map((campaign) => {
            return (
              <Campaign key={campaign._id} campaign={campaign} />
            )
          })
          : (
              <div className="alert alert-info">
                <p>
                  No active campaigns.
                </p>
              </div>
            )
        }
      </div>
    )
  }
});

let Campaign = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    campaign: React.PropTypes.object.isRequired
  },

  getMeteorData() {
    return {
      keyphrases: Keyphrases.find({campaign_id: this.props.campaign.id}).fetch()
    }
  },

  getInitialState() {
    return {
      isOpen: false
    };
  },

  handleToggle(e) {
    let $toggle = $(React.findDOMNode(this.refs.toggle));
    $toggle.slideToggle()
    this.setState({isOpen: !this.state.isOpen});
  },

  handleToggleAllTweets(e) {
    Campaigns.stealthUpdate({id: this.props.campaign.id}, {$set: {hidden: !this.props.campaign.hidden}});
    // Automatically reloads conversations from updating keyphrases {hidden: true} cursor
    this.data.keyphrases.forEach((keyphrase) => {
      Keyphrases.stealthUpdate({id: keyphrase.id}, {$set: {hidden: !keyphrase.hidden}});
    });
  },

  render() {
    let campaign = this.props.campaign;
    return (
      <div className="campaign-toggle keyphrase" data-addclass-hidden-phrase="hidden">
        <div className="campaign-details keyword-details" onClick={this.handleToggle}>
          <span className="chevron glyphicon glyphicon-chevron-down" data-addclass-glyphicon-chevron-up="open" data-removeclass-glyphicon-chevron-down="open"></span>
          <span className="phrase" title={campaign.name || "No name"}>{campaign.name || "No name"}</span>
          <span className="glyphicon glyphicon-eye-close"></span>
        </div>
        <div className="campaign-info" ref="toggle">
          <div className="refresh-tweets">
            <button className="col-md-12 btn-success ladda-button" data-event-click="getFreshTweets | withArguments id" data-style="zoom-in">
              <span className="ladda-label">
                <span className="glyphicon glyphicon-refresh"></span>
                <span>Get fresh tweets</span>
              </span>
            </button>
          </div>
          <div className="keyword-performance-indicators">
            <ul className="indicators">
              <li>
                <span className="context">Sent Tweet Replies</span>
                <span className="value">{campaign.replied_to_conversations_count}</span>
              </li>
              <li>
                <span className="context">New Customers</span>
                <span className="value">{campaign.conversions}</span>
              </li>
              <li>
                <span className="context">Total Clicks</span>
                <span className="value">{campaign.clicks}</span>
              </li>
              <li className="conversion_rate">
                <span className="context">Conversion Rate</span>
                <span className="perc">%</span>
                <span className="value">{campaign.conversion_rate}</span>
              </li>
              <li className="click_thru_rate">
                <span className="context">Click-thru Rate</span>
                <span className="perc">%</span>
                <span className="value">{campaign.click_thru_rate}</span>
              </li>
            </ul>
          </div>
          <div className="keyword-list">
            <div>
              <span>Keywords:</span>
              <span className="hide-tweets" onClick={this.handleToggleAllTweets}>
                {campaign.hidden ? "SHOW TWEETS" : "HIDE TWEETS"}
              </span>
              <span className="sc-tooltip keyword-info">
                <span className="glyphicon glyphicon-info-sign"></span>
                <span className="sc-tooltip-content">Hide / show tweets for each keyword</span>
              </span>
            </div>
            {this.data.keyphrases? (
              <ul>
                {this.data.keyphrases.map((keyphrase) => {
                  return (
                    <CampaignKeyphraseItem key={keyphrase.id} keyphrase={keyphrase} />
                  )
                })}
              </ul>
            ) : (
              <div className="clearfix">
                <div className="col-xs-12">
                  <p className="text-info">
                    No active keywords. You will not see any tweets for this campaign until you <a data-route="routes.campaign[campaign.id]">add some</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
});

let CampaignKeyphraseItem = React.createClass({
  propTypes: {
    keyphrase: React.PropTypes.object.isRequired
  },

  handleToggleTweets(e) {
    Keyphrases.stealthUpdate({id: this.props.keyphrase.id}, {$set: {hidden: !this.props.keyphrase.hidden}});
  },

  render() {
    let keyphrase = this.props.keyphrase;
    return (
      <li onClick={this.handleToggleTweets} className={classNames({"disabled": keyphrase.hidden === true},{"enabled": keyphrase.hidden === false})}>
        <span className="text">{keyphrase.phrase}</span>
        <span className={classNames("glyphicon",
          {"glyphicon-eye-open": keyphrase.hidden === false},
          {"glyphicon-eye-close": keyphrase.hidden === true})}>
        </span>
      </li>
    )
  }

});