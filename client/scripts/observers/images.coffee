# Wait for collection to be available
Meteor.startup ->
  Images.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    Images.observer = Images.find().observe
      added: (doc) ->
        unless init
          API.Images.create doc,
            error: ->
              Images._remove({id: doc.id})
            success: (data, statusText) ->
              Images._update(doc._id, {$set: data})
      # FIXME - Need to send the entire doc on this request as the API required the url
      # If backend is able to remove that requirement, we can change this
      # changed: Images.observeChangedCallback.bind(Images)
      changed: (newDoc, oldDoc) ->
        API.Images.update newDoc,
          error: ->
            Images._update({id: oldDoc.id}, {$set: oldDoc})
      removed: (oldDoc) ->
        API.Images.delete {id: oldDoc.id},
          error: (err, res) ->
            Images._insert(oldDoc)
    init = false