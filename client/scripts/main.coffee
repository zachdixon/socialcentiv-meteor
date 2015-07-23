Template.main.rendered = ->
  Tracker.autorun ->
    if Session.get('currentUser')?
      API.businesses.getSingle
        user_id: Session.get('currentUser').id
      , (err, res) ->
        unless err
          Session.set('business', res[0])
    if Session.get('business')?
      API.campaigns.getAll
        business_id: Session.get('business').id
      , (err, res) ->
        unless err
          Campaigns.observer.stop()
          Campaigns.remove({})
          res.forEach (doc) ->
            Campaigns.insert doc
          Campaigns.startObserving()
          # Remove once multiple campaigns implemented
          Session.set 'campaign', res[0]

Template.main.helpers
  header: ->
    App.Components.Header
  footer: ->
    App.Components.Footer

# TODO - change to use collections.find
Template.registerHelper 'user', ->
  Session.get('currentUser')
Template.registerHelper 'business', ->
  Session.get('business')
Template.registerHelper 'campaign', ->
  Session.get('campaign')
