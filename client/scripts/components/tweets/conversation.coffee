class Conversation extends BlazeComponent
  @register 'Conversation'

  onCreated: ->
    @replyState = new ReactiveVar(false)
    @replyLength = new ReactiveVar(0)
    @maxReplyLength = (115 - @data().lbc_tweet.author_screen_name.length)

  onRendered: ->

  timeFromNow: ->
    moment(@data().posted_at)?.fromNow(true)

  location: ->
    @data().location or "N/A"

  remainingChars: ->
    @maxReplyLength - @replyLength.get() #- (if @selectedImages.get().length then 26 else 0)

  replyStatusClass: ->
    if parseInt(@remainingChars()) < 0 then 'redText' else ''

  invalidReplyLength: ->
    state = false
    if @remainingChars() < 0
      state = true
    else if @replyLength.get() is 0
      state = true
    state

  events: -> [
    'click .btn-reply, click .tweet-row, click .tweet-row *:not(a):not(button)': @toggleReply
    'click .delete': @fadeAndDestroy
    'keyup .reply-txt': @onReplyTextChange
  ]

  toggleReply: (e) ->
    e.stopPropagation()
    $("li.comment.active").not($(@firstNode())).removeClass('active').find(".reply-section").hide()

    if $(@firstNode()).hasClass('active')
      @cancelReply e
    else
      $(@firstNode()).addClass('active')
        .find('.reply-section').slideDown(200)
      @$('.reply-txt')
        .css('text-indent', @$('.reply-username').width())
        .focus()

  cancelReply: (e) ->
    $(@firstNode()).removeClass('active').find(".reply-section").slideUp(200)

  onReplyTextChange: (e) ->
    val = $(e.currentTarget).val()
    @replyLength.set(val.length)
    @data().reply_message = val
  
  fadeAndDestroy: (e) ->
    e.stopPropagation()
    $(@firstNode()).slideUp 200, =>
      @delete()

  delete: () ->
    Conversations.remove(@data()._id)