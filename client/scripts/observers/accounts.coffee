# Wait for collection to be available
Meteor.startup ->
  Accounts.startObserving = ->
    Accounts.observers = Accounts.find().observe
      # added: (doc) ->
      changed: Accounts.observeChangedCallback.bind(Accounts)
