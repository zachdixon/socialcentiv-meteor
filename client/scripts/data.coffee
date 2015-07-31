Meteor.startup ->
  Tracker.autorun ->
    # Get Business
    if Session.get('currentUser')?
      API.businesses.getSingle
        user_id: Session.get('currentUser').id
      , (err, res) ->
        unless err
          Session.set('business', res[0])
    # Get Campaigns
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