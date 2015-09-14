"use strict";

import { CONSTANTS } from 'Constants';

import { classNames } from 'app-deps';
import { ShowFor } from 'ShowFor';
import { CampaignsSelector } from 'client/scripts/components/tweets/campaign-selector';
import { SuggestedResponses } from 'client/scripts/components/tweets/suggested-responses';

let {string, number, object, array, func, oneOfType} = React.PropTypes;

let {BO,IP} = CONSTANTS;


export let ConversationsList = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      conversations: Conversations.find().fetch(),
      responses: Session.get('suggestedResponses') || []
    };
  },

  componentWillMount() {
    Conversations.loadMore();
  },
  
  render() {
    return (
      <ul className="convos clearfix">
        {this.data.conversations.map((conversation) => {
          return (
            <Conversation 
              key={conversation._id}
              conversation_id={conversation.id}
              responses={this.data.responses}
            />
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
    conversation_id: number.isRequired,
    responses: array
  },

  getMeteorData() {
    let business = Businesses.findOne(Session.get('business')._id),
        conversation = Conversations.findOne({id: this.props.conversation_id}),
        keyphrases = Keyphrases.find({id: {$in: conversation.keyphrase_ids}}).fetch(),
        campaign_ids = keyphrases.map((kp) => { return kp.campaign_id;}),
        campaigns = Campaigns.find({id: {$in: campaign_ids}, status: 'active'}, {sort: {default: 1}}).fetch(),
        selected_images = Images.find({campaign_id: this.state.reply_campaign_id, selected: true}).fetch();
    return {
      business: business,
      conversation: conversation,
      keyphrases: keyphrases,
      campaigns: campaigns,
      keywordHighlightOn: Session.get('keyword-highlight-on'),
      selectedImages: selected_images
    };
  },

  getInitialState() {
    return {
      reply_message: "",
      reply_campaign_id: null
    };
  },

  componentWillMount() {
    this.max_reply_length = (115 - this.data.conversation.lbc_tweet.author_screen_name.length);
  },

  componentDidMount() {
    let reply_campaign_id = this.data.conversation.reply_campaign_id || _.get(this.data.campaigns,'0.id') || "none";
    this.setReplyCampaignId(reply_campaign_id);
  },

  messageWithLinks() {
    let message = this.data.conversation.lbc_tweet.message,
        urlRegex;

    urlRegex = /(?:https?:\/\/)?[-a-zA-Z0-9@:%_\+~#!=]{1,256}\.[a-z]{2,3}\b([-a-zA-Z0-9@:%_\+~#?!&\/\/=]*)/g;

    message = message.replace(urlRegex, function(url) {
      let src = url;
      if (url.indexOf('http') === -1) {
        src = 'http://' + src;
      }
      return '<a target="_blank" href="' + src + '">' + url + '</a>';
    });

    return message;
  },

  messageHighlighted() {
    let phrases = _.pluck(this.data.keyphrases, 'phrase'),
        message = this.messageWithLinks();

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
    let time = moment(this.data.conversation.lbc_tweet.posted_at);
    return time? time.fromNow(true) : "";
  },

  location() {
    return this.data.conversation.lbc_tweet.location || "N/A";
  },

  remainingChars() {
    return this.max_reply_length - (this.state.reply_message.length || 0) - (this.data.selectedImages.length? 26 : 0) + ((this.data.conversation.reply_campaign_id == "none")? 23 : 0);
  },

  invalidReplyLength() {
    return (this.remainingChars() < 0) || (this.state.reply_message.length == 0);
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

  setReplyCampaignId(value) {
    this.setState({reply_campaign_id: value});
    // Conversations._update({id: this.data.conversation.id}, {$set: {reply_campaign_id: value}});
  },

  handleReplyMessageChange(e) {
    this.setState({reply_message: e.target.value});
  },

  handleCampaignChange(e) {
    let value = parseInt(e.target.value) || e.target.value;
    this.setReplyCampaignId(value);
  },

  handleSuggestedResponseClick(responses, e) {
    let response = responses? responses[Math.floor((Math.random() * responses.length))] : "";
    this.setState({reply_message: response});
  },

  handleRetweet(e) {
    e.stopPropagation();
    Conversations.update({id: this.data.conversation.id}, {$set: {retweet: true}});
  },

  handleFavorite(e) {
    e.stopPropagation();
    Conversations.update({id: this.data.conversation.id}, {$set: {favorite_tweet: true}});
  },

  handleEditPhotosClick(e) {
    // Set activeConversation so image gallery knows which images to load
    Session.set('activeConversationCampaignId', this.state.reply_campaign_id);
  },

  handleDelete(e) {
    e.stopPropagation();
    $("body").css("overflow", "");
    let _this = this;

    $(this.getDOMNode()).slideUp(500, function() {
      Conversations.remove(_this.data.conversation._id, (err) => {
        if (err) {
          console.log(err);
          $(this.getDOMNode()).slideDown(500);
        } else {
          Businesses.update(_this.data.business._id, {$inc: {replyable_conversations: -1}});
        }
      });
    });


    // setTimeout(function() {
    //   return _this.conversation.destroy(function(err) {
    //     let currentAccount, error_message, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    //     if (err) {
    //       error_message = err.request != null ? (_ref = $.parseJSON((_ref1 = err.request) != null ? _ref1.response : void 0).errors) != null ? (_ref2 = _ref[0].lbc_tweet) != null ? _ref2[0] : void 0 : void 0 : void 0;
    //       if (error_message !== void 0 && error_message === 'has already been taken') {
    //         $(_this.node).remove();
    //         currentAccount = Session.get('currentAccount').transaction();
    //         return currentAccount.set('replyable_conversations', currentAccount.get('replyable_conversations') - 1);
    //       } else {
    //         $(_this.node).slideDown();
    //         return Messenger().error({
    //           id: 'deleteTweetError',
    //           message: ((_ref3 = $.parseJSON(((_ref4 = err.request) != null ? _ref4.response : void 0) || '[]').errors) != null ? (_ref5 = _ref3[0].base) != null ? _ref5[0] : void 0 : void 0) || "There was a problem deleting that tweet",
    //           hideAfter: 4
    //         });
    //       }
    //     } else {
    //       currentAccount = Session.get('currentAccount');
    //       currentAccount.set('replyable_conversations', Session.get('currentAccount').replyable_conversations - 1);
    //       return currentAccount.save();
    //     }
    //   });
    // }, 500);

  },

  handleReply(e) {
    let _id = this.data.conversation._id,
        business_id = this.data.business._id,
        $comment = $(this.getDOMNode());
    Conversations.update(_id, {$set: {
      status: "replied_to",
      reply_campaign_id: this.state.reply_campaign_id,
      reply_message: this.state.reply_message,
      callbacks: {
        error: function(xhr, textStatus, error) {
          // FIXME - figure out error format
          // let errors, notFound, phrase, response, _ref;
          // response = $.parseJSON(err.request.response);
          // errors = response != null ? response.errors : void 0;
          // phrase = errors != null ? (_ref = errors[0].base) != null ? _ref[0] : void 0 : void 0;
          // notFound = (phrase != null ? phrase.toLowerCase().indexOf("notfound") : void 0) > -1;

          // if (notFound) {
          //   Conversations._remove(_id);
          // }
          Conversations._remove(_id);
        },
        success: function(data, statusText) {
          var _this = this;

          $comment.fadeOut(500, function() {
            Conversations._remove(_id);
            Businesses.update(business_id, {$inc: {'replyable_conversations': -1}});
          });
        }
      }
    }}, (err, numDocs) => {
      if (err) {
        debugger
      }
    });

  },

  render() {
    
    let {business, conversation} = this.data,
        {lbc_tweet, reply_tweet} = conversation,
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
              <span className="timeFromNow" onClick={this.handleToggleReply}>{this.timeFromNow()}</span>
              <span className="hide-if-mobile" onClick={this.handleToggleReply}>ago</span>
              <span className="hide-if-mobile location" onClick={this.handleToggleReply} title={this.location()}>{this.location()}</span>
              </div>
            <p className="tweet-msg" onClick={this.handleToggleReply} dangerouslySetInnerHTML={{__html: this.messageHighlighted()}}></p>
            <div className="tweet-tools inner" onClick={this.handleToggleReply}>
              <div className="tool-inner inner" onClick={this.handleToggleReply}>
                <button className="plain reply-button btn-reply comment-option pull-left sc-tooltip">
                  <span className="icon-reply icon"></span>
                  <span className="sc-tooltip-content">Reply</span>
                </button>
                <button className={classNames("retweet","plain","sc-tooltip",{active: conversation.retweet})}
                        onClick={this.handleRetweet}
                        disabled={conversation.retweet}>
                  <span className="iconmoon icon-retweet icon ignore-toggle" onClick={this.handleRetweet}></span>
                  <span className="sc-tooltip-content">Retweet</span>
                </button>
                <button className={classNames("fav","plain","sc-tooltip",{active: conversation.favorite_tweet})}
                        onClick={this.handleFavorite}
                        disabled={conversation.favorite_tweet}>
                  <span className="iconmoon icon-star icon ignore-toggle"></span>
                  <span className="sc-tooltip-content">Favorite</span>
                </button>
                <button className="delete plain sc-tooltip"
                        data-original-title="Delete this conversation"
                        onClick={this.handleDelete}>
                  <span className="icon-trash icon"></span>
                  <span className="sc-tooltip-content">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="reply-section">
          <CampaignsSelector
            conversation_id={conversation.id}
            reply_campaign_id={this.state.reply_campaign_id}
            campaigns={this.data.campaigns}
            onChange={this.handleCampaignChange} 
          />
          {/*<ShowFor type={BO}>
            <SuggestedResponses responses={this.props.responses} onCategoryClick={this.handleSuggestedResponseClick} />
          </ShowFor>*/ /* FIXME - implement new suggested responses */} 
          <div className="reply-subsection nomargin">
            <div className="reply-avatar">
              <img className="img img-rounded" width="32" src={business? business.twitter_avatar_url : void 0} />
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
              {/* Only show campaign link when a campaign is selected */}
              {this.state.reply_campaign_id === "none" ? null : (
                <label className="reply-link">{business? business.public_url : void 0}</label>
              )}
            </div>
            <div className="row">
              <ReplyImages images={this.data.selectedImages} />
              <div className="col-md-12">
                <div className="reply-tools clearfix">
                  {/*Only show Edit photos button when campaign is selected */}
                  {this.state.reply_campaign_id === "none"? null: (
                    <div className="pull-left">
                      <a className="btn-flat clearfix" data-toggle="modal" href="#gallery-modal" onClick={this.handleEditPhotosClick}>
                        <span className="glyphicon glyphicon-camera pull-left"></span>
                        <span className="pull-left">Edit photos</span>
                      </a>
                    </div>
                  )}
                  <div className="pull-right">
                    <span className={classNames('count','top10','pull-left',{'red-text': red_text})}>{this.remainingChars()}</span>
                    <button className="btn-send-reply btn btn-large btn-primary border-bottom ladda-button pull-right"
                            disabled={this.invalidReplyLength()}
                            onClick={this.handleReply}>
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

let ReplyImages = React.createClass({
  propTypes: {
    images: array
  },

  render() {
    let images = this.props.images;
    if (images.length) {
      return (
        <div className="col-md-12">
          <div className="images clearfix" data-count={images.length}>
            {images.map((image) => {
              return (
                <div className="image-wrapper" key={image.id}>
                  <image src={image.url} />
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
});
