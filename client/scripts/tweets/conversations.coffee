
Tracker.autorun ->
  if Session.get('business')?
    API.conversations.getAll
      business_id: Session.get('business').id
      num_per_page: 10
      status: 'awaiting_reply'
      order_by: 'newest'
    , (err, res) ->
      unless err
        Session.set('conversations', res)

Template.conversationsList.helpers
  'conversations': ->
    Session.get('conversations')

Template.conversation.helpers
  timeFromNow: ->
    moment(@posted_at)?.fromNow(true)
  location: ->
    @location or "N/A"


