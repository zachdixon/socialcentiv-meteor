@App =
  Collections: {}
  Deps: {}
  Layouts: {}
  Components: {}
  Utils: {}
if Meteor.isClient
  App.DOMAIN = location.hostname.replace(/http:\/\/.+?\./, '').replace(/^[^.]+\./g, "")