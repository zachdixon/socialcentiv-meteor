# Wait for collection to be available
Meteor.startup ->
  RadiusTargets.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    RadiusTargets.observer = RadiusTargets.find().observe
      added: (doc) ->
        unless init
          API.RadiusTargets.create(doc, (err, res) ->)
      changed: (newDoc, oldDoc) ->
        API.RadiusTargets.update newDoc, (err, res) ->
          if err
            RadiusTargets.update(oldDoc._id, {$set: oldDoc})
      removed: (oldDoc) ->
        API.RadiusTargets.delete({id: oldDoc.id}, (err, res) ->
          if err
            RadiusTargets.insert(oldDoc)
          )
    init = false