# Wait for collection to be available
Meteor.startup ->
  Conversations.startObserving = ->
    Conversations.observer = Conversations.find().observe
      changed: Conversations.observeChangedCallback.bind(Conversations)
      removed: (oldDoc) ->
        # console.log('deleted')
        API.Conversations.delete {id: oldDoc.id}, (err, res) ->
          if err
            # Check error if tweet was already deleted
            # If not, add convo back to collection and
            # throw Messenger() error
            Conversations.stealthInsert(oldDoc)