
TweetsPage = React.createClass
  render: ->
    { 
      AccountDetails,
      # KeywordsWidget,
      ConversationsList
    } = App.Components
    
    <div className="conversations-index">
      <div id="left-col" className="hidden-xs clearfix">
        <AccountDetails />
      </div>
    </div>

_.extend App.Components, { TweetsPage }