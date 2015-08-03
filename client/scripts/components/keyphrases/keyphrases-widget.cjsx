{ classNames } = NpmDependencies

{string, array, object, bool} = React.PropTypes

KeyphrasesWidget = React.createClass

  mixins: [ReactMeteorData]

  getMeteorData: ->

    positiveKeyphrases: Keyphrases.find({action_type: "pump"}).fetch()
    NegativeKeyphrases: Keyphrases.find({action_type: "filter"}).fetch()

  
  render: ->
    <div id="keywordphrases">
      <KeyphrasesList type="positive" keyphrases={@data.positiveKeyphrases} />
      <hr />
      <KeyphrasesList type="negative" keyphrases={@data.negativeKeyphrases} />
    </div>

KeyphrasesList = React.createClass

  propTypes:
    type: string.isRequired
    keyphrases: array
  
  render: ->
    <div className="positive-keyphrases">
      <div className="tips">
        <a className="btn-manage-keywords" href="">Edit</a>
        <div className="label">
          {if @props.type is "positive" then "KEYPHRASES" else "EXCLUDE THESE KEYPHRASES"}
        </div>
      </div>
      {
        if @props.keyphrases?.length
          @props.keyphrases.map (keyphrase) =>
            <Keyphrase key={keyphrase.id} type={@props.type} keyphrase={keyphrase} />
      }
    </div>

Keyphrase = React.createClass

  propTypes:
    type: string.isRequired
    keyphrase: object.isRequired
    showDelete: bool

  getInitialState: ->
    is_open: false

  render: ->
    if @props.type is "positive"
      <div className="keyphrase">
        <div className={classNames("keyword-details", "open": @state.is_open)}>
          <span className={classNames("chevron", "glyphicon", "glyphicon-chevron-up": @state.is_open, "glyphicon-chevron-down": !@state.is_open)}></span>
          <span className="phrase" title={@props.keyphrase.phrase}>{@props.keyphrase.phrase}</span>
          <span className="hide-tweets">HIDE TWEETS</span>
          {
            if @props.showDelete
              <span className="btn glyphicon-trash glyphicon"></span>
          }
        </div>
        <div className="keyword-performance-indicators">
          <ul className="indicators">
            <li className="conversion_rate">
              <span className="context">Conversion Rate</span>
              <span className="perc">%</span>
              <span className="value">{@props.keyphrase.conversion_rate}</span>
            </li>
            <li className="click_thru_rate" style={display: "none !important"}>
              <span className="context">Click-thru Rate</span>
              <span className="perc">%</span>
              <span className="value">{@props.keyphrase.click_thru_rate}</span>
            </li>
            <li className="replied_to">
              <span className="context">Replied Tweets</span>
              <span className="value">{@props.keyphrase.replied_to_conversations_count}</span>
            </li>
            <li className="deleted">
              <span className="context">Deleted Tweets</span>
              <span className="value">{@props.keyphrase.deleted_conversations_count}</span>
            </li>
            <li className="new_customers">
              <span className="context">New Customers</span>
              <span className="value">{@props.keyphrase.conversions}</span>
            </li>
            <li className="tweets_with_keyword">
              <span className="context">Tweets with this keyword</span>
              <span className="value">{@props.keyphrase.pending_conversations_count}</span>
            </li>
          </ul>
        </div>
      </div>
    else if @props.type is "negative"
      <div className="keyphrase">
        <div className="keyword-details less">
          <span className="phrase">{@props.keyphrase.phrase}</span>
        </div>
      </div>

_.extend App.Components, {KeyphrasesWidget}
