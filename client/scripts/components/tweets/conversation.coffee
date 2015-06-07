# Conversation =
#   toggleReply: (e, doc) ->
#     e.stopPropagation()
#     $node = $(doc.firstNode)
#     $("li.comment.active").not($node).removeClass('active').find(".reply-section").hide()

#     if $node.hasClass('active')
#       Conversation.cancelReply e,doc
#     else
#       $node.addClass('active')
#         .find('.reply-section').slideDown(200)
#       $node.find('.reply-txt')
#         .css('text-indent', $node.find('.reply-username').width())
#         .focus()
#       doc.replyState.set true
#   cancelReply: (e, doc) ->
#     $node = $(doc.firstNode)
#     $node.removeClass('active').find(".reply-section").slideUp(200)
#   delete: (e, doc) ->
#     e.preventDefault()
#     Conversations.remove(doc.data._id)

# Template.conversation.created = ->
#   @replyState = new ReactiveVar(false)

# Template.conversation.helpers
#   timeFromNow: ->
#     moment(@posted_at)?.fromNow(true)
#   location: ->
#     @location or "N/A"

# Template.conversation.events
#   'click .btn-reply, click .tweet-row, click .tweet-row *:not(a):not(button)': Conversation.toggleReply
#   'click .delete': Conversation.delete

class Conversation extends BlazeComponent
  @register 'Conversation'

  onCreated: ->
    @replyState = new ReactiveVar(false)

  onRendered: ->

  timeFromNow: ->
    moment(@data().posted_at)?.fromNow(true)

  location: ->
    @data().location or "N/A"

  events: -> [
    'click .btn-reply, click .tweet-row, click .tweet-row *:not(a):not(button)': @toggleReply
    'click .delete': @fadeAndDestroy
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
      @replyState.set true

  cancelReply: (e) ->
    $(@firstNode()).removeClass('active').find(".reply-section").slideUp(200)
  
  fadeAndDestroy: (e) ->
    e.stopPropagation()
    $(@firstNode()).slideUp 200, =>
      @delete()

  delete: () ->
    Conversations.remove(@data()._id)