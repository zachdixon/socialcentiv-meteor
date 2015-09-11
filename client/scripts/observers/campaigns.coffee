# Wait for collection to be available
Meteor.startup ->
  Campaigns.startObserving = ->
    Campaigns.observer = Campaigns.find().observe
      # added: (doc) ->
      changed: Campaigns.observeChangedCallback.bind(Campaigns)