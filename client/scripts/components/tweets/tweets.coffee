class Tweets extends BlazeComponent
  @register 'Tweets'

  events: -> [
    'click .sort-by button': @onSortByClick
    'click .per-page button': @onNumPerPageClick
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
          keyphrase_ids: Keyphrases.find()
        , (err, res) ->
          unless err
            # Stop observer, remove all current records, insert new records, start observer
            Conversations.observer.stop()
            Conversations.remove({})
            res.forEach (doc) ->
              Conversations.insert doc
            Conversations.startObserving()

  onSortByClick: (e) ->
    val = $(e.currentTarget).attr('value')
    @order_by.set val

  onNumPerPageClick: (e) ->
    val = $(e.currentTarget).attr('value')
    @num_per_page.set parseInt(val)

  orderBy: ->
    @order_by.get()

  numPerPage: ->
    @num_per_page.get()

  totalConversations: ->
    count = Session.get('business')?.replyable_conversations
    if count > 1000
      count = "1000+"
    count or 0

class AccountDetails extends BlazeComponent
  @register 'AccountDetails'

  twitter_avatar_large: ->
    @currentData().twitter_avatar_url?.replace("_normal","")