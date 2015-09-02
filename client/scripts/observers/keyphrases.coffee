# Wait for collection to be available
Meteor.startup ->
  Keyphrases.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    Keyphrases.observer = Keyphrases.find().observe
      added: (doc) ->
        unless init
          API.keyphrases.create(doc, (err, res) ->)
      changed: Keyphrases.observeChangedCallback.bind(Keyphrases)
      removed: (oldDoc) ->
        API.keyphrases.delete({id: oldDoc.id}, (err, res) ->
          if err
            Keyphrases.insert(oldDoc)
          )
    init = false