# Wait for collection to be available
Meteor.startup ->
  Keyphrases.startObserving = ->
    init = true # Prevents initial records from calling the added callback
    Keyphrases.observer = Keyphrases.find().observe
      added: (doc) ->
        unless init
          doc.campaign_id = Session.get('campaign').id
          API.keyphrases.create(doc, (err, res) ->)
      changed: (newDoc, oldDoc) ->
      removed: (oldDoc) ->
        API.keyphrases.delete({id: oldDoc.id}, (err, res) ->
          if err
            Keyphrases.insert(oldDoc)
          )
    init = false

  Tracker.autorun ->
    if Session.get('campaign')
      Keyphrases.startObserving()
    else
      Keyphrases.observer?.stop()