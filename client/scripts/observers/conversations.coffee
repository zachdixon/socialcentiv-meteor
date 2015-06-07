# Wait for collection to be available
Meteor.startup ->
  # Runs anytime find() cursor changes
  # Using autorun to automatically stop observe() when finished
  # Otherwise it will run forever
  Tracker.autorun ->
    Conversations.find().observe
      # added: (doc) ->
      changed: (newDoc, oldDoc) ->
        API.conversations.update newDoc, (err, res) ->
          if err
            Conversations.update(oldDoc._id, {$set: oldDoc})
      removed: (oldDoc) ->
        API.conversations.delete({id: oldDoc.id}, (err, res) ->
          if err
            # Check error if tweet was already deleted
            # If not, add convo back to collection and
            # throw Messenger() error
            Conversations.insert(oldDoc)
          )