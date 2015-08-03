
{classNames} = NpmDependencies

{string, array, func} = React.PropTypes

SuggestedResponses = React.createClass
  mixins: [ReactMeteorData]
  
  propTypes:
    responses: array.isRequired
    onCategoryClick: func.isRequired

  getMeteorData: ->
    local = localStorage.getItem('suggestionsOpen')
    open = if local?
      if local is 'true' then true else false
    else
      true
    Session.setDefault('suggestionsOpen', open)

    open: Session.get('suggestionsOpen')

  toggleSuggestions: (e) ->
    open = @data.open

    $(React.findDOMNode(@refs.suggestions)).slideToggle(400)
    
    # unless open
    #   @getCategoryResponses('invite')

    localStorage.setItem 'suggestionsOpen', !open
    Session.set 'suggestionsOpen', !open

  render: ->
    header_text = if @data.open
      "Choose a Category for Suggested Replies"
    else
      "Not Sure What To Say? Try a Suggested Reply"

    button_text = if @data.open
      "Hide Suggestions"
    else
      "Show Suggestions"

    <div className={classNames('suggested-replies', 'showing-suggestions': @data.open)}>
      <div className="try-suggestions clearfix">
        <p className="suggestions-header">{header_text}</p>
        <span className="show-suggestions" onClick={@toggleSuggestions}>{button_text}</span>
      </div>
      <div className="suggestions clearfix" ref="suggestions">
        <ul>
          {
            @props.responses.map (responses) =>
              <SuggestedResponseCategory key={responses.id} category={responses.category} responses={responses.responses} onClick={@props.onCategoryClick} />
          }
        </ul>
        <div className="sc-tooltip suggestions-help">
          <span className="glyphicon glyphicon-info-sign"></span>
          <span className="sc-tooltip-content">More info</span>
        </div>
        <a className="see-next" href="#">See Next Suggestion<span className="glyphicon glyphicon-chevron-right"></span></a>
      </div>
    </div>

SuggestedResponseCategory = React.createClass
  propTypes:
    category: string.isRequired
    responses: array.isRequired
    onClick: func.isRequired

  getInitialState: ->
    response = @props.responses?[Math.floor((Math.random() * @props.responses?.length))]

    random_response: response

  render: ->
    <li className="sc-tooltip" onClick={@props.onClick.bind(null, @props.responses)}>
      {@props.category}
      <span className="sc-tooltip-content">
        {@state.random_response}
      </span>
    </li>

_.extend App.Components, {SuggestedResponses, SuggestedResponseCategory}