@Conversations = new Mongo.Collection('conversations', connection: null)
App.Collections.conversations = Conversations
# schema = new SimpleSchema({})
# Conversations.attachSchema(schema)