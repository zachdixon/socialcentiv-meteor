class Keyphrase extends BlazeComponent
  @register 'Keyphrase'

  onCreated: ->
    @open = new ReactiveVar(false)

  onRendered: ->
    unless @componentParent()._firstKeyphrase
      @componentParent()._firstKeyphrase = @
      @toggleKeyword.call(@)

  onDestroyed: ->
    @componentParent()._firstKeyphrase = null

  events: -> [
    'click .keyword-details': @toggleKeyword
  ]

  toggleKeyword: (e) ->
    keyphrase = @currentData()
    if keyphrase.action_type is 'pump'
      $toggle = $(@firstNode()).closest('.keyphrase').find('.keyword-performance-indicators')
      $toggle.slideToggle()
      @open.set(!@open.get())

  isOpen: ->
    @open.get()