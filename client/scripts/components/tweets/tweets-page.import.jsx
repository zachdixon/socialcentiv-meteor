"use strict";

import { classNames } from 'app-deps';
import { ShowFor } from 'ShowFor';
import { CONSTANTS } from 'Constants';

import { AccountDetails } from 'client/scripts/components/tweets/account-details';
import { CampaignsWidget } from 'client/scripts/components/tweets/campaigns-widget';
import { HighlightToggle } from 'client/scripts/components/tweets/highlight-toggle';
import { ConversationsList } from 'client/scripts/components/tweets/conversations';
import { CampaignImagesModal } from 'client/scripts/components/tweets/campaign-images-modal';

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
    let dict = App.Dicts.Conversations,
        business_id = Session.get('business')? Session.get('business')._id : null;
    dict.setDefault('orderBy', 'newest');
    dict.setDefault('numPerPage', 10);
    return {
      business: Businesses.findOne(business_id),
      keyphrases: Keyphrases.find().fetch(),
      orderBy: dict.get('orderBy'),
      numPerPage: dict.get('numPerPage')
    }
  },

  getTotalConversations() {
    let count = this.data.business? this.data.business.replyable_conversations : null;
    if (count > 1000) count = "1000+";
    return count || 0;
  },

  handleOrderByClick(e) {
    App.Dicts.Conversations.set('orderBy', e.target.value);
  },

  handleNumPerPageClick(e) {
    App.Dicts.Conversations.set('numPerPage', parseInt(e.target.value));
  },

  render() {
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
                    className={classNames("convo-sort-button", "newest", {"active": this.data.orderBy == 'newest'})}
                    value="newest"
                    onClick={this.handleOrderByClick}>
                    NEWEST
                  </button>
                  <button
                    className={classNames("convo-sort-button", "oldest", {"active": this.data.orderBy == 'oldest'})}
                    value="oldest"
                    onClick={this.handleOrderByClick}>
                    OLDEST
                  </button>
                </div>
                <div className="per-page">
                  <span>Per Page:</span>
                  <button
                    className={classNames("few-count", {"active": this.data.numPerPage == 5})}
                    value="5"
                    onClick={this.handleNumPerPageClick}>
                    5
                  </button>
                  <button
                    className={classNames("few-count", {"active": this.data.numPerPage == 10})}
                    value="10"
                    onClick={this.handleNumPerPageClick}>
                    10
                  </button>
                  <button
                    className={classNames("more-count", {"active": this.data.numPerPage == 20})}
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
              <CampaignImagesModal />
              <ConversationsList />
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
    let business_id = Session.get('business')? Session.get('business')._id : null;
    return {
      business: Businesses.findOne(business_id),
      conversations: Conversations.find().fetch()
    }
  },
  handleClick(e) {
    Conversations.remove({}, (err, numDocs) => {
      if (err) {
        console.log(err);
      } else {
        Businesses.update(this.data.business._id, {
          $inc: {
            replyable_conversations: (numDocs * -1)
          }
        });
        // FIXME - need to call loadMore after all api delete calls have finished
        // Maybe move this to the Tracker.autorun in data.coffee
        // track Conversations.find(), if none, call API.
        // Remember to cancel calls when call returns no results to prevent infinite loop
        Conversations.loadMore()
      }
    });
  },
  render() {
    if(this.data.conversations.length) {
      return (
        <div className="row">
          <div className="load-page col-md-12 col-xs-12" onClick={this.handleClick}>
            DELETE TWEETS &amp; LOAD MORE
          </div>
        </div>
      )
    } else {
      return null
    }
    
  }
});
