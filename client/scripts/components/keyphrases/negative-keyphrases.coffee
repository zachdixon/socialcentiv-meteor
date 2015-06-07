class NegativeKeyphrases extends BlazeComponent
  @register 'NegativeKeyphrases'

  keyphrases: ->
    Keyphrases.find({action_type: "filter"})


