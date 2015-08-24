"use strict";

import { classNames } from 'app-deps';
import { ShowFor } from 'ShowFor';
import { CONSTANTS } from 'Constants';

import { AccountDetails } from 'client/scripts/components/tweets/account-details';
import { CampaignsWidget } from 'client/scripts/components/tweets/campaigns-widget';
import { HighlightToggle } from 'client/scripts/components/tweets/highlight-toggle';
import { ConversationsList } from 'client/scripts/components/tweets/conversations';

let {BO,IP,AM,ADMIN} = CONSTANTS;

export let TweetsPage = React.createClass({
  displayName: "TweetsPage",
  render() {
    return (
      <div className="conversations-index">
        <LeftColumn />
        <div className="center-right-wrapper col-xs-12">
          <CenterColumn />
          <RightColumn />
        </div>
      </div>
    )
  }
});

let LeftColumn = React.createClass({
  displayName: "LeftColumn",
  render() {
    return (
      <div id="left-col" className="hidden-xs clearfix">
        <AccountDetails />
        <HighlightToggle />
        <CampaignsWidget />
      </div>
    )
  }
});

let CenterColumn = React.createClass({
  displayName: "CenterColumn",

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      business: Session.get('business'),
      keyphrases: Keyphrases.find().fetch()
    }
  },

  getInitialState() {
    return {
      conversationCount: 0,
      orderBy: "newest",
      numPerPage: 10
    }
  },

  componentDidMount() {
    this.getConversations()
  },

  getTotalConversations() {
    let count = this.data.business? this.data.business.replyable_conversations : null;
    if (count > 1000) count = "1000+";
    return count || 0;
  },

  getConversations() {
    if (this.data.business && this.data.keyphrases.length) {
      API.Conversations.getAll({
        business_id: this.data.business.id,
        num_per_page: this.state.numPerPage,
        status: 'awaiting_reply',
        order_by: this.state.orderBy,
        keyphrase_ids: this.data.keyphrases.map(function(kp) {if(!kp.hidden) { return kp.id}}).join(','),
      }, (err, res) => {
        if (res && !err) {
          // Stop observer, remove all current records, insert new records, start observer
          Conversations.replaceWith(res.data);
        }
      });
    }
  },

  handleOrderByClick(e) {
    this.setState({orderBy: e.target.value});
  },

  handleNumPerPageClick(e) {
    this.setState({numPerPage: parseInt(e.target.value)});
  },

  render() {
    this.getConversations();
    return (
      <div className="comments" id="center-col">
        <div className="col-xs-12">
          <div>
            <div className="header clearfix row">
              <div className="tweet-count pull-left">
                <span className="count">{this.getTotalConversations()}</span>
                <span className="text">Tweets</span>
              </div>
              <div className="sort-bar pull-right">
                <div className="sort-by">
                  <span>Sort By:</span>
                  <button
                    className={classNames("convo-sort-button", "newest", {"active": this.state.orderBy == 'newest'})}
                    value="newest"
                    onClick={this.handleOrderByClick}>
                    NEWEST
                  </button>
                  <button
                    className={classNames("convo-sort-button", "oldest", {"active": this.state.orderBy == 'oldest'})}
                    value="oldest"
                    onClick={this.handleOrderByClick}>
                    OLDEST
                  </button>
                </div>
                <div className="per-page">
                  <span>Per Page:</span>
                  <button
                    className={classNames("few-count", {"active": this.state.numPerPage == 5})}
                    value="5"
                    onClick={this.handleNumPerPageClick}>
                    5
                  </button>
                  <button
                    className={classNames("few-count", {"active": this.state.numPerPage == 10})}
                    value="10"
                    onClick={this.handleNumPerPageClick}>
                    10
                  </button>
                  <button
                    className={classNames("more-count", {"active": this.state.numPerPage == 20})}
                    value="20"
                    onClick={this.handleNumPerPageClick}>
                    20
                  </button>
                </div>
              </div>
            </div>
            <div className="row" role="alert" style={{display: "none !important"}}>
              <div className="col-xs-12">
                <div className="alert alert-info hidden-tweets-alert">
                  <span>You have (</span>
                  <span className="total-tweets" style={{display: "none !important"}}>0</span>
                  <span>) hidden Tweets! Unhide a few keywords.</span>
                </div>
              </div>
            </div>
            <div className="conversations row">
              {/*galleryModal*/ }
              <div>
                <ConversationsList />
              </div>
            </div>
            <LoadMoreButton />
          </div>
        </div>
      </div>
    )
  }
});

let RightColumn = React.createClass({
  displayName: "RightColumn",
  render() {
    return (
      <div id="right-col">
        <ShowFor type={BO}>
          <div className="tips">
            <p className="label">Tweet Reply Tips</p>
            <div className="tip">
              <p className="header">Juice it up</p>
              <p>Ensure your Tweet is as appealing as possible to help drive a higher conversion rate.</p>
            </div>
            <div className="tip">
              <p className="header">Less characters, more opportunities</p>
              <p>The 140 character limit is already difficult to work with, but we’re challenging you to aim to use even less. In fact, Tweets with less than 100 characters receive the highest engagement.</p>
            </div>
            <div className="tip">
              <p className="header">Know Your Audience</p>
              <p>Understanding your target audience is a key factor in determining the success of your social strategy. Therefore, keep your ideal customer in mind when replying to Tweets.</p>
            </div>
          </div>
        </ShowFor>
      </div>
    )
  }
});

let LoadMoreButton = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      conversations: Conversations.find().fetch()
    }
  },
  render() {
    if(this.data.conversations.length) {
      return (
        <div className="row">
          <div className="load-page col-md-12 col-xs-12">DELETE TWEETS &amp; LOAD MORE</div>
        </div>
      )
    } else {
      return null
    }
    
  }
});
