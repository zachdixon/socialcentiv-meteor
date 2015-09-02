# Wait for collection to be available
Meteor.startup ->
  console.log 'campaigns startup'
  Campaigns.startObserving = ->
    console.log 'campaigns start observing'
    Campaigns.observer = Campaigns.find().observe
      # added: (doc) ->
      changed: Campaigns.observeChangedCallback.bind(Campaigns)
      removed: (oldDoc) ->
        API.Campaigns.delete {id: oldDoc.id}, (err, res) ->
          if err
            # Check error if campaign was already deleted
            # If not, add campaign back to collection and
            # throw Messenger() error
            Campaigns.insert(oldDoc)

  # Tracker.autorun ->
  #   if Session.get('business')
  #     Campaigns.startObserving()
  #   else
  #     Campaigns.observer?.stop()