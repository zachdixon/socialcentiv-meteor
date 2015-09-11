# Wait for collection to be available
Meteor.startup ->
  Keyphrases.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    Keyphrases.observer = Keyphrases.find().observe
      added: (doc) ->
        unless init
          API.Keyphrases.create(doc, (err, res) ->)
      changed: Keyphrases.observeChangedCallback.bind(Keyphrases)
      removed: (oldDoc) ->
        API.Keyphrases.delete {id: oldDoc.id},
          error: (err, res) ->
            Keyphrases._insert(oldDoc)
    init = false
    this.stopObserving()