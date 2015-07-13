@App =
  Collections: {}
  Deps: {}
  Components: {}
if Meteor.isClient
  App.DOMAIN = location.hostname.replace(/http:\/\/.+?\./, '').replace(/^[^.]+\./g, "")