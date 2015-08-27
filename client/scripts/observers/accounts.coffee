# Wait for collection to be available
Meteor.startup ->
  Accounts.startObserving = ->
    Accounts.observer = Accounts.find().observe
      # added: (doc) ->
      changed: (newDoc, oldDoc) ->
        API.Accounts.update newDoc, (err, res) ->
          if err
            Accounts.update(oldDoc._id, {$set: oldDoc})