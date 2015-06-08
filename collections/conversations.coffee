@Conversations = new Mongo.Collection('conversations', connection: null)
App.collections.conversations = Conversations
# schema = new SimpleSchema({})
# Conversations.attachSchema(schema)