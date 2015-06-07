class PositiveKeyphrases extends BlazeComponent
  @register 'PositiveKeyphrases'

  keyphrases: ->
    Keyphrases.find({action_type: "pump"})


