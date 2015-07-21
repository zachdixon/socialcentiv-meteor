@Conversations = new Mongo.Collection('conversations', connection: null)
@Keyphrases = new Mongo.Collection('keyphrases', connection: null)
App.collections =
  conversations: Conversations
  keyphrases: Keyphrases