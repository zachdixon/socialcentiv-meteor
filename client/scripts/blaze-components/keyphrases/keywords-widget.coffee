class KeywordsWidget extends BlazeComponent
  @register 'KeywordsWidget'

  onCreated: ->
    @autorun ->
      if Session.get('campaign')?
        campaign_id = Session.get('campaign').id
        API.keyphrases.getAll {campaign_id: campaign_id}, (err, res) ->
          unless err
            Keyphrases.observer?.stop()
            Keyphrases.remove({})
            res.forEach (doc) ->
              doc.campaign_id = campaign_id
              Keyphrases.insert doc
            Keyphrases.startObserving()
  onDestroyed: ->
    console.log 'destroyed keyphrases widget'
    @_firstKeyphrase = null if @_firstKeyphrase?