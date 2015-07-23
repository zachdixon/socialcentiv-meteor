# Wait for collection to be available
Meteor.startup ->
  Conversations.startObserving = ->
    Conversations.observer = Conversations.find().observe
      # added: (doc) ->
      changed: (newDoc, oldDoc) ->
        API.conversations.update newDoc, (err, res) ->
          if err
            Conversations.update(oldDoc._id, {$set: oldDoc})
      removed: (oldDoc) ->
        API.conversations.delete {id: oldDoc.id}, (err, res) ->
          if err
            # Check error if tweet was already deleted
            # If not, add convo back to collection and
            # throw Messenger() error
            Conversations.insert(oldDoc)

  Tracker.autorun ->
    if Session.get('currentUser')
      Conversations.startObserving()
    else
      Conversations.observer?.stop()