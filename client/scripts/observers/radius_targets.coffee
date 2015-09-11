# Wait for collection to be available
Meteor.startup ->
  RadiusTargets.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    RadiusTargets.observer = RadiusTargets.find().observe
      added: (doc) ->
        unless init
          API.RadiusTargets.create(doc, (err, res) ->)
      changed: RadiusTargets.observeChangedCallback.bind(RadiusTargets)
      removed: (oldDoc) ->
        API.RadiusTargets.delete {id: oldDoc.id},
          error: (err, res) ->
            RadiusTargets._insert(oldDoc)
    init = false