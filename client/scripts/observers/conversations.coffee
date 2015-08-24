# Wait for collection to be available
Meteor.startup ->
  Conversations.startObserving = ->
    Conversations.observer = Conversations.find().observe
      # added: (doc) ->
      changed: (newDoc, oldDoc) ->
        API.Conversations.update newDoc, (err, res) ->
          if err
            Conversations.update({id: oldDoc.id}, {$set: oldDoc})
      removed: (oldDoc) ->
        API.Conversations.delete {id: oldDoc.id}, (err, res) ->
          if err
            # Check error if tweet was already deleted
            # If not, add convo back to collection and
            # throw Messenger() error
            Conversations.insert(oldDoc)