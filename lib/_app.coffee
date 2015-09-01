@App =
  Collections: {}
  Deps: {}
  Layouts: {}
  Components: {}
  Utils: {}
  Dicts: {}
if Meteor.isClient
  App.DOMAIN = location.hostname.replace(/http:\/\/.+?\./, '').replace(/^[^.]+\./g, "")

  App.setCurrentUserCookies = (email, auth) ->
    Cookie.set('currentUserEmail', email, {path: "/", domain: App.DOMAIN});
    Cookie.set('currentUserAuth', auth, {path: "/", domain: App.DOMAIN});

  App.clearCurrentUserCookies = () ->
    Cookie.remove('currentUserEmail', {path: '/', domain: App.DOMAIN});
    Cookie.remove('currentUserAuth', {path: '/', domain: App.DOMAIN});

  App.setAdvancedUserCookies = (email, auth) ->
    Cookie.set('advancedUserEmail', email, {path: "/", domain: App.DOMAIN})
    Cookie.set('advancedUserAuth', auth, {path: "/", domain: App.DOMAIN})

  App.clearAdvancedUserCookies = () ->
    Cookie.remove('advancedUserEmail', {path: "/", domain: App.DOMAIN})
    Cookie.remove('advancedUserAuth', {path: "/", domain: App.DOMAIN})

Meteor.startup ->
  App.Dicts.Conversations = new ReactiveDict()
