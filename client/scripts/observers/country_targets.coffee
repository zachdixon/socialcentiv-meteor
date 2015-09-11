# Wait for collection to be available
Meteor.startup ->
  CountryTargets.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    CountryTargets.observer = CountryTargets.find().observe
      added: (doc) ->
        unless init
          API.CountryTargets.create doc
      changed: CountryTargets.observeChangedCallback.bind(CountryTargets)
      removed: (oldDoc) ->
        API.CountryTargets.delete {id: oldDoc.id},
          error: (err, res) ->
            CountryTargets._insert oldDoc
    init = false