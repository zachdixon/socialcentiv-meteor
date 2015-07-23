# Wait for collection to be available
Meteor.startup ->
  Campaigns.startObserving = ->
    Campaigns.observer = Campaigns.find().observe
      # added: (doc) ->
      changed: (newDoc, oldDoc) ->
        API.Campaigns.update newDoc, (err, res) ->
          if err
            Campaigns.update(oldDoc._id, {$set: oldDoc})
      removed: (oldDoc) ->
        API.Campaigns.delete {id: oldDoc.id}, (err, res) ->
          if err
            # Check error if campaign was already deleted
            # If not, add campaign back to collection and
            # throw Messenger() error
            Campaigns.insert(oldDoc)

  Tracker.autorun ->
    if Session.get('business')
      Campaigns.startObserving()
    else
      Campaigns.observer?.stop()