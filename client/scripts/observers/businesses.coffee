# Wait for collection to be available
Meteor.startup ->
  Businesses.startObserving = ->
    Businesses.observers = Businesses.find().observe
      changed: Businesses.observeChangedCallback.bind(Businesses)