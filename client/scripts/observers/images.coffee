# Wait for collection to be available
Meteor.startup ->
  Images.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    Images.observer = Images.find().observe
      added: (doc) ->
        unless init
          API.Images.create doc, (err, res) ->
            if err
              Images._remove({id: doc.id})
            else
              Images._update(doc._id, {$set: res.data})
      changed: Images.observeChangedCallback.bind(Images)
      removed: (oldDoc) ->
        API.Images.delete {id: oldDoc.id},
          error: (err, res) ->
            Images._insert(oldDoc)
    init = false