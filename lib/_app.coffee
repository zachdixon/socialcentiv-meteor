@App =
  Collections: {}
  Deps: {}
  Components: {}
if Meteor.isClient
  App.DOMAIN = location.hostname.replace(/http:\/\/.+?\./, '').replace(/^[^.]+\./g, "")

Meteor.startup ->
  if Meteor.isClient
    App.ThemeManager = new NpmDependencies.MUI.Styles.ThemeManager()
    # Colors = NpmDependencies.MUI.Styles.Colors
    # App.ThemeManager.setPalette
    #   primary1Color: Colors.cyan500
    #   primary2Color: Colors.cyan700
    #   primary3Color: Colors.cyan100
    #   accent1Color: Colors.pinkA200
    #   accent2Color: Colors.pinkA400
    #   accent3Color: Colors.pinkA100
    #   textColor: Colors.darkBlack
    #   canvasColor: Colors.white
    #   borderColor: Colors.grey300
    #   disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3)

    # App.ThemeManager.setComponentThemes
    #   textField:
    #     textColor: palette.textColor
    #     hintColor: palette.disabledColor
    #     floatingLabelColor: palette.textColor
    #     disabledTextColor: palette.disabledColor
    #     errorColor: Colors.red500
    #     focusColor: palette.primary1Color
    #     backgroundColor: 'transparent'
    #     borderColor: palette.borderColor

    React.initializeTouchEvents(true)
    NpmDependencies.injectTapEventPlugin()