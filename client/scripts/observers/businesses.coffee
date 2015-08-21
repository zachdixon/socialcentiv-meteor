# Wait for collection to be available
Meteor.startup ->
  Businesses.startObserving = ->
    Businesses.observer = Businesses.find().observe
      # added: (doc) ->
      changed: (newDoc, oldDoc) ->
        API.Businesses.update newDoc, (err, res) ->
          if err
            Businesses.update(oldDoc._id, {$set: oldDoc})