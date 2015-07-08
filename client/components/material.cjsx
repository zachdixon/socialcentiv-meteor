ThemeManager = new MUI.Styles.ThemeManager()

{
  AppBar,
  DatePicker,
  TextField
} = MUI

React.initializeTouchEvents(true)

@App = React.createClass
  childContextTypes:
    muiTheme: React.PropTypes.object

  getChildContext: ->
    muiTheme: ThemeManager.getCurrentTheme()

  render: ->
    <div>
      <AppBar title='Title' iconClassNameRight="muidocs-icon-navigation-expand-more"/>
      <DatePicker hintText="Landscape Dialog" mode="landscape" />
      <TextField hintText="Hint Text" />
    </div>


Meteor.startup ->
  WebFontConfig =
    google: { families: [ 'Roboto:400,300,500:latin' ] }
    
  do ->
    wf = document.createElement("script")
    wf.src = (if "https:" is document.location.protocol then "https" else "http") + "://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"
    wf.type = "text/javascript"
    wf.async = "true"
    s = document.getElementsByTagName("script")[0]
    s.parentNode.insertBefore wf, s

  injectTapEventPlugin()