@App =
  Collections: {}
  Utils: {}
if Meteor.isClient
  App.DOMAIN = location.hostname.replace(/http:\/\/.+?\./, '').replace(/^[^.]+\./g, "")