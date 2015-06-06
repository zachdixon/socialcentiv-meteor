Tracker.autorun ->
  if Session.get('currentUser')?
    API.businesses.getSingle
      user_id: Session.get('currentUser').id
    , (err, res) ->
      unless err
        Session.set('business', res[0])

Tracker.autorun ->
  if Session.get('business')?
    API.campaigns.getSingle
      business_id: Session.get('business').id
    , (err, res) ->
      unless err
        Session.set('campaign', res[0])