
TweetsPage = React.createClass
  render: ->
    { 
      AccountDetails,
      KeyphrasesWidget,
      ConversationsList
    } = App.Components

    <div className="conversations-index">
      <div id="left-col" className="hidden-xs clearfix">
        <AccountDetails />
        <KeyphrasesWidget />
      </div>
    </div>

_.extend App.Components, { TweetsPage }