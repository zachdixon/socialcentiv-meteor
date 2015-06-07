class Tweets extends BlazeComponent
  @register 'Tweets'

  events: -> [
    # 'click .sort-by button': @sortBy
  ]

  onCreated: ->
    @num_per_page = new ReactiveVar(10)
    @order_by = new ReactiveVar('newest')
    @autorun =>
      if Session.get('business')?
        API.conversations.getAll
          business_id: Session.get('business').id
          num_per_page: @num_per_page.get()
          status: 'awaiting_reply'
          order_by: @order_by.get()
        , (err, res) ->
          unless err
            # Session.set('conversations', res)
            res.forEach (doc) ->
              Conversations.insert doc

  sortBy: (e) ->
    val = $(e.currentTarget).attr('value')
    @order_by.set val

  totalConversations: ->
    count = Session.get('business')?.replyable_conversations
    if count > 1000
      count = "1000+"
    count or 0

class AccountDetails extends BlazeComponent
  @register 'AccountDetails'

  twitter_avatar_large: ->
    @currentData().twitter_avatar_url?.replace("_normal","")