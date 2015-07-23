{classNames} = NpmDependencies

{string, object, array, func} = React.PropTypes

ConversationsList = React.createClass
  mixins: [ReactMeteorData]

  getMeteorData: ->
    conversations: Conversations.find().fetch()

  getInitialState: ->
    responses: []

  componentWillMount: ->
    @getSuggestedResponses()

  getSuggestedResponses: ->
    API.suggestedResponses.getAll {}, (err, result) =>
      unless err
        order = ["invite", "agree", "celebrate", "support", "sympathize"]
        sortedResults = []
        for sortedCategory in order
          for category in result
            if sortedCategory is category.category.toLowerCase()
              sortedResults.push category
        @setState responses: sortedResults

  render: ->
    <ul className="convos clearfix">
      {
        @data.conversations.map (conversation) =>
          <Conversation key={conversation.id} conversation=conversation responses={@state.responses} />
      }
    </ul>


Conversation = React.createClass
  mixins: [ReactMeteorData]

  propTypes:
    conversation: object.isRequired
    responses: array.isRequired

  getMeteorData: ->
    business: Session.get('business')

  getInitialState: ->
    reply_length: 0
    reply_message: ""

  componentWillMount: ->
    @max_reply_length = (115 - @props.conversation.lbc_tweet.author_screen_name.length)

  componentDidMount: ->
    $(@getDOMNode()).on 'click', '.btn-reply, .tweet-row, .tweet-row *:not(a):not(button)', @handleToggleReply

  timeFromNow: ->
    moment(@props.conversation.posted_at)?.fromNow(true)

  location: ->
    @props.conversation.location or "N/A"

  remainingChars: ->
    @max_reply_length - (@state.reply_message.length or 0) - (if @selectedImages().length then 26 else 0) + (if @props.conversation.reply_campaign_id is "none" then 23 else 0)

  invalidReplyLength: ->
    (@remainingChars() < 0) or (@state.reply_length is 0)

  selectedImages: ->
    []

  handleToggleReply: (e) ->
    e.stopPropagation()
    $domNode = $(@getDOMNode())
    $("li.comment.active").not($domNode).removeClass('active').find(".reply-section").hide()

    if $domNode.hasClass('active')
      $domNode.removeClass('active').find(".reply-section").slideUp(200)
    else
      $domNode.addClass('active')
        .find('.reply-section').slideDown(200)
      $domNode.find('.reply-txt')
        .css('text-indent', $domNode.find('.reply-username').width())
        .focus()

  handleReplyMessageChange: (e) ->
    @setState {reply_message: e.target.value}

  handleSuggestedResponseClick: (responses, e) ->
    response = responses?[Math.floor((Math.random() * responses?.length))]
    @setState {reply_message: response}


  render: ->
    lbc_tweet = @props.conversation.lbc_tweet
    reply_tweet = @props.conversation.reply_tweet

    red_text = @remainingChars() < 0

    <li className="comment nopadding">
      <div className="tweet-row clearfix">
        <div className="tweet-stuff inner">
          <div className="user-avatar">
            <img className="img img-rounded" width="60" src={lbc_tweet.author_avatar_url} />
          </div>
          <div className="tweet-details">
            <span className="name">{lbc_tweet.author_name}</span>
            <a className="comment-user-handle" target="_blank" href={"https://twitter.com/#{lbc_tweet.author_screen_name}"}>
              <span className="username">{"@#{lbc_tweet.author_screen_name}"}</span>
            </a>
            <span className="timeFromNow">{lbc_tweet.timeFromNow}</span>
            <span className="hide-if-mobile" style={{display:'inline-block'}}>ago</span>
            <span className="hide-if-mobile location" title={@location()}>{@location()}</span>
            </div>
          <p className="tweet-msg">{lbc_tweet.message}</p>
          <div className="tweet-tools inner">
            <div className="tool-inner inner">
              <button className="plain reply-button btn-reply comment-option pull-left sc-tooltip"><span className="icon-reply icon"></span><span className="sc-tooltip-content">Reply</span></button>
              <button className="retweet plain sc-tooltip"><span className="iconmoon icon-retweet icon"></span><span className="sc-tooltip-content">Retweet</span></button>
              <button className="fav plain sc-tooltip"><span className="iconmoon icon-star icon"></span><span className="sc-tooltip-content">Favorite</span></button>
              <button className="delete plain sc-tooltip" data-original-title="Delete this conversation"><span className="icon-trash icon"></span><span className="sc-tooltip-content">Delete</span></button>
            </div>
          </div>
        </div>
      </div>
      <div className="reply-section">
        <SuggestedResponses responses={@props.responses} onCategoryClick={@handleSuggestedResponseClick} />
        <div className="reply-subsection nomargin">
          <div className="reply-avatar">
            <img className="img img-rounded" width="32" src={@data.business.twitter_avatar_url} />
          </div>
          <div className="reply-text-wrapper">
            <label className="reply-username">{"@#{lbc_tweet.author_screen_name}"}</label>
            <textarea className={classNames('reply-txt', 'form-control' ,'red-text': red_text)} name="comment-reply-text" placeholder="Reply or Use Suggested Replies" value={@state.reply_message} onChange={@handleReplyMessageChange}></textarea>
            <label className="reply-link">{@data.business.public_url}</label>
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
                  <span className={classNames('count','top10','pull-left','red-text': red_text)}>{@remainingChars()}</span>
                  <button className="btn-send-reply btn btn-large btn-primary border-bottom ladda-button pull-right" disabled={@invalidReplyLength()}>
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

SuggestedResponses = React.createClass
  mixins: [ReactMeteorData]
  
  propTypes:
    responses: array.isRequired
    onCategoryClick: func.isRequired

  getMeteorData: ->
    local = localStorage.getItem('suggestionsOpen')
    open = if local?
      if local is 'true' then true else false
    else
      true
    Session.setDefault('suggestionsOpen', open)

    open: Session.get('suggestionsOpen')

  toggleSuggestions: (e) ->
    open = @data.open

    $(React.findDOMNode(@refs.suggestions)).slideToggle(400)
    
    # unless open
    #   @getCategoryResponses('invite')

    localStorage.setItem 'suggestionsOpen', !open
    Session.set 'suggestionsOpen', !open

  render: ->
    header_text = if @data.open
      "Choose a Category for Suggested Replies"
    else
      "Not Sure What To Say? Try a Suggested Reply"

    button_text = if @data.open
      "Hide Suggestions"
    else
      "Show Suggestions"

    <div className={classNames('suggested-replies', 'showing-suggestions': @data.open)}>
      <div className="try-suggestions clearfix">
        <p className="suggestions-header">{header_text}</p>
        <span className="show-suggestions" onClick={@toggleSuggestions}>{button_text}</span>
      </div>
      <div className="suggestions clearfix" ref="suggestions">
        <ul>
          {
            @props.responses.map (responses) =>
              <SuggestedResponseCategory key={responses.id} category={responses.category} responses={responses.responses} onClick={@props.onCategoryClick} />
          }
        </ul>
        <div className="sc-tooltip suggestions-help">
          <span className="glyphicon glyphicon-info-sign"></span>
          <span className="sc-tooltip-content">More info</span>
        </div>
        <a className="see-next" href="#">See Next Suggestion<span className="glyphicon glyphicon-chevron-right"></span></a>
      </div>
    </div>

SuggestedResponseCategory = React.createClass
  propTypes:
    category: string.isRequired
    responses: array.isRequired
    onClick: func.isRequired

  getInitialState: ->
    random_response: ""

  componentWillMount: ->
    @getRandomResponse(@props.category)

  getRandomResponse: (categoryName) ->
    response = @props.responses?[Math.floor((Math.random() * @props.responses?.length))]
    @setState {random_response: response}
    response

  render: ->
    <li className="sc-tooltip" onClick={@props.onClick.bind(null, @props.responses)}>
      {@props.category}
      <span className="sc-tooltip-content">
        {@state.random_response}
      </span>
    </li>

_.extend App.Components, {ConversationsList, Conversation, SuggestedResponses, SuggestedResponseCategory}