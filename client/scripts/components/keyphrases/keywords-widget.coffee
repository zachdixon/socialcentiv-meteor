class KeywordsWidget extends BlazeComponent
  @register 'KeywordsWidget'

  onCreated: ->
    @autorun ->
      if Session.get('business')? and Session.get('campaign')?
        API.keyphrases.getAll {campaign_id: Session.get('campaign').id}, (err, res) ->
          unless err
            res.forEach (doc) ->
              Keyphrases.insert doc