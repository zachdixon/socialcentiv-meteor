class KeywordsWidget extends BlazeComponent
  @register 'KeywordsWidget'

  onCreated: ->
    @autorun ->
      if Session.get('campaign')?
        API.keyphrases.getAll {campaign_id: Session.get('campaign').id}, (err, res) ->
          unless err
            Keyphrases.observer?.stop()
            Keyphrases.remove({})
            res.forEach (doc) ->
              Keyphrases.insert doc
            Keyphrases.startObserving()
  onDestroyed: ->
    console.log 'destroyed keyphrases widget'
    @_firstKeyphrase = null if @_firstKeyphrase?