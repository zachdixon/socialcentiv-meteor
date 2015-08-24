# Wait for collection to be available
Meteor.startup ->
  Images.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    Images.observer = Images.find().observe
      added: (doc) ->
        unless init
          API.Images.create(doc, (err, res) ->)
      changed: (newDoc, oldDoc) ->
        API.Images.update newDoc, (err, res) ->
          if err
            Images.update(oldDoc._id, {$set: oldDoc})
      removed: (oldDoc) ->
        API.Images.delete({id: oldDoc.id}, (err, res) ->
          if err
            Images.insert(oldDoc)
          )
    init = false