class ConversationsList extends BlazeComponent
  @register 'ConversationsList'

  conversations: ->
    Conversations.find()

