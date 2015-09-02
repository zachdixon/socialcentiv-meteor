# Wait for collection to be available
Meteor.startup ->
  Images.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    Images.observer = Images.find().observe
      added: (doc) ->
        unless init
          API.Images.create doc, (err, res) ->
            if err
              Images.stealthRemove({id: doc.id})
            else
              Images.stealthUpdate(doc._id, {$set: res.data})
      changed: Images.observeChangedCallback.bind(Images)
      removed: (oldDoc) ->
        API.Images.delete({id: oldDoc.id}, (err, res) ->
          if err
            Images.insert(oldDoc)
          )
    init = false