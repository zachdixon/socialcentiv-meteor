Meteor.startup ->
  Tracker.autorun ->
    # Get Business
    if Session.get('currentUser')?
      API.businesses.getSingle
        user_id: Session.get('currentUser').id
      , (err, res) ->
        unless err
          Session.set('business', res.data[0])

  Tracker.autorun ->
    # Get Campaigns
    if Session.get('business')?
      API.campaigns.getAll
        business_id: Session.get('business').id
      , (err, res) ->
        unless err
          Campaigns.observer.stop()
          Campaigns.remove({})
          res.data.forEach (doc) ->
            Campaigns.insert doc
          Campaigns.startObserving()
          # Remove once multiple campaigns implemented
          Session.set 'campaign', res.data[0]

  Tracker.autorun ->
    # Get Keyphrases
    if Session.get('campaign')?
      campaign_id = Session.get('campaign').id
      API.keyphrases.getAll
        campaign_id: campaign_id
      , (err, res) ->
        unless err
          Keyphrases.observer?.stop()
          Keyphrases.remove({})
          res.data.forEach (doc) ->
            doc.campaign_id = campaign_id
            Keyphrases.insert doc
          Keyphrases.startObserving()

  Tracker.autorun ->
    # Get accounts
    if Session.get('currentUser')?
      if Session.get('currentUser').type isnt "BusinessOwner"
        $.get "http://private-c3fb2-socialcentiv1.apiary-mock.com/managed_businesses.json", (result) ->
          Session.set('accounts', result)
