"use strict";

import { classNames } from 'app-deps';
import { CampaignsSelector } from 'client/scripts/components/tweets/campaign-selector';
import { SuggestedResponses } from 'client/scripts/components/tweets/suggested-responses';

let {string, number, object, array, func, oneOfType} = React.PropTypes;


export let ConversationsList = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      conversations: Conversations.find().fetch(),
      responses: Session.get('suggestedResponses') || []
    };
  },
  render() {
    return (
      <ul className="convos clearfix">
        {this.data.conversations.map((conversation) => {
          return (
            <Conversation key={conversation.id} conversation={conversation} responses={this.data.responses} />
          )
        })}
      </ul>
    )
  }
});


let Conversation = React.createClass({
  displayName: "Conversation",
  mixins: [ReactMeteorData],

  propTypes: {
    conversation: object.isRequired,
    responses: array
  },

  getMeteorData() {
    return {
      business: Session.get('business'),
      keyphrases: Keyphrases.find({id: {$in: this.props.conversation.keyphrase_ids}}).fetch(),
      keywordHighlightOn: Session.get('keyword-highlight-on')
    };
  },

  getInitialState() {
    return {
      reply_length: 0,
      reply_message: "",
      reply_campaign_id: this.props.conversation.reply_campaign_id
    };
  },

  componentWillMount() {
    this.max_reply_length = (115 - this.props.conversation.lbc_tweet.author_screen_name.length);
  },

  messageHighlighted() {
    let phrases = _.pluck(this.data.keyphrases, 'phrase'),
        message = this.props.conversation.lbc_tweet.message;

    phrases.forEach((phrase) => {
      let singular = _.singularize(phrase),
          plural = _.pluralize(phrase);

      if (singular !== phrase) phrases.push(singular);
      if (plural !== phrase) phrases.push(plural);
    });
    phrases = phrases.join('|');

    if (phrases.length && this.data.keywordHighlightOn) {
      let regex = new RegExp(`(\w+)?(${phrases})+(\w+)?`, "ig");
      return message.replace(regex, "<span class='highlight'>$2</span>");
    } else {
      return message;
    }
  },

  timeFromNow() {
    let time = moment(this.props.conversation.posted_at);
    return time? time.fromNow(true) : "";
  },

  location() {
    return this.props.conversation.location || "N/A";
  },

  remainingChars() {
    return this.max_reply_length - (this.state.reply_message.length || 0) - (this.selectedImages().length? 26 : 0) + ((this.props.conversation.reply_campaign_id == "none")? 23 : 0);
  },

  invalidReplyLength() {
    return (this.remainingChars() < 0) || (this.state.reply_length == 0);
  },

  selectedImages() {
    return [];
  },

  handleToggleReply(e) {
    e.stopPropagation();
    let $domNode = $(this.getDOMNode());
    $("li.comment.active").not($domNode).removeClass('active').find(".reply-section").hide();

    if ($domNode.hasClass('active')) {
      $domNode.removeClass('active').find(".reply-section").slideUp(200);
    } else {
      $domNode.addClass('active')
        .find('.reply-section').slideDown(200);
      $domNode.find('.reply-txt')
        .css('text-indent', $domNode.find('.reply-username').width())
        .focus();
    }
  },

  handleReplyMessageChange(e) {
    this.setState({reply_message: e.target.value});
  },

  handleCampaignChange(e) {
    let value = e.target.value;
    this.setState({reply_campaign_id: parseInt(value) || value});
  },

  handleSuggestedResponseClick(responses, e) {
    let response = responses? responses[Math.floor((Math.random() * responses.length))] : "";
    this.setState({reply_message: response});
  },

  handleRetweet(e) {
    e.stopPropagation();
    Conversations.update({id: this.props.conversation.id}, {$set: {retweet: true}});
  },

  handleFavorite(e) {
    e.stopPropagation()
    Conversations.update({id: this.props.conversation.id}, {$set: {favorite_tweet: true}});
  },

  render() {
    
    let conversation = this.props.conversation,
        lbc_tweet = conversation.lbc_tweet,
        reply_tweet = conversation.reply_tweet,
        red_text = this.remainingChars() < 0;

    return (
      <li className="comment nopadding">
        <div className="tweet-row clearfix" onClick={this.handleToggleReply}>
          <div className="tweet-stuff inner" onClick={this.handleToggleReply}>
            <div className="user-avatar" onClick={this.handleToggleReply}>
              <img className="img img-rounded" onClick={this.handleToggleReply} width="60" src={lbc_tweet.author_avatar_url} />
            </div>
            <div className="tweet-details" onClick={this.handleToggleReply}>
              <span className="name" onClick={this.handleToggleReply}>{lbc_tweet.author_name}</span>
              <a className="comment-user-handle" target="_blank" href={`https://twitter.com/${lbc_tweet.author_screen_name}`}>
                <span className="username">{`@${lbc_tweet.author_screen_name}`}</span>
              </a>
              <span className="timeFromNow" onClick={this.handleToggleReply}>{lbc_tweet.timeFromNow}</span>
              <span className="hide-if-mobile" onClick={this.handleToggleReply} style={{display:'inline-block'}}>ago</span>
              <span className="hide-if-mobile location" onClick={this.handleToggleReply} title={this.location()}>{this.location()}</span>
              </div>
            <p className="tweet-msg" onClick={this.handleToggleReply} dangerouslySetInnerHTML={{__html: this.messageHighlighted()}}></p>
            <div className="tweet-tools inner" onClick={this.handleToggleReply}>
              <div className="tool-inner inner" onClick={this.handleToggleReply}>
                <button className="plain reply-button btn-reply comment-option pull-left sc-tooltip">
                  <span className="icon-reply icon"></span>
                  <span className="sc-tooltip-content">Reply</span>
                </button>
                <button className={classNames("retweet","plain","sc-tooltip",{active: conversation.retweet})} onClick={this.handleRetweet} disabled={conversation.retweet}>
                  <span className="iconmoon icon-retweet icon ignore-toggle" onClick={this.handleRetweet}></span>
                  <span className="sc-tooltip-content">Retweet</span>
                </button>
                <button className={classNames("fav","plain","sc-tooltip",{active: conversation.favorite_tweet})} onClick={this.handleFavorite} disabled={conversation.favorite_tweet}>
                  <span className="iconmoon icon-star icon ignore-toggle"></span>
                  <span className="sc-tooltip-content">Favorite</span>
                </button>
                <button className="delete plain sc-tooltip" data-original-title="Delete this conversation"><span className="icon-trash icon"></span><span className="sc-tooltip-content">Delete</span></button>
              </div>
            </div>
          </div>
        </div>
        <div className="reply-section">
          <CampaignsSelector
            conversation_id={conversation.id}
            reply_campaign_id={this.state.reply_campaign_id}
            keyphrase_ids={conversation.keyphrase_ids}
            onChange={this.handleCampaignChange} 
          />
          <SuggestedResponses responses={this.props.responses} onCategoryClick={this.handleSuggestedResponseClick} />
          <div className="reply-subsection nomargin">
            <div className="reply-avatar">
              <img className="img img-rounded" width="32" src={this.data.business.twitter_avatar_url} />
            </div>
            <div className="reply-text-wrapper">
              <label className="reply-username">{`@${lbc_tweet.author_screen_name}`}</label>
              <textarea 
                  className={classNames('reply-txt', 'form-control' ,{'red-text': red_text})}
                  name="comment-reply-text"
                  placeholder="Reply or Use Suggested Replies"
                  value={this.state.reply_message}
                  onChange={this.handleReplyMessageChange}>
              </textarea>
              <label className="reply-link">{this.data.business.public_url}</label>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="images clearfix" data-count="0">
                </div>
              </div>
              <div className="col-md-12">
                <div className="reply-tools clearfix">
                  <div className="pull-left">
                    <a className="btn-flat clearfix" data-toggle="modal" href="#gallery-modal">
                      <span className="glyphicon glyphicon-camera pull-left"></span>
                      <span className="pull-left">Edit photos</span>
                    </a>
                  </div>
                  <div className="pull-right">
                    <span className={classNames('count','top10','pull-left',{'red-text': red_text})}>{this.remainingChars()}</span>
                    <button className="btn-send-reply btn btn-large btn-primary border-bottom ladda-button pull-right" disabled={this.invalidReplyLength()}>
                      <span className="glyphicon glyphicon-send"></span>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a className="trigger-wisepops stealth" href="#wisepops"></a>
      </li>
    )
  }
});
