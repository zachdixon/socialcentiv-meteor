View =
  toggleSubNav: (e, doc) ->
    e.preventDefault()
    e.stopPropagation()
    $subnav = $(e.currentTarget).siblings('.sub-nav')

    $subnav.toggle()

    # Attach event on body to close subnav unless target is sub nav
    if $subnav.is(':visible')
      $navlinks = $subnav.find('.sub-nav-link')
      $('body').on 'click.hide-sub-nav', (e) =>
        unless $(e.currentTarget).closest('.sub-nav').is($subnav)
          $subnav.hide()
          # Remove event once called to prevent duplicates
          $('body').off 'click.hide-sub-nav'
  logout: (e, doc) ->
    e.preventDefault()
    # Clear cookies
    Cookie.remove('currentUserEmail', {path: '/', domain: App.DOMAIN})
    Cookie.remove('currentUserAuth', {path: '/', domain: App.DOMAIN})
    # Clear session variables
    Object.keys(Session.keys).forEach (key) ->
      Session.set key, undefined
    # Clearing currentUser should stop observers, but just in case
    # Clear local collections
    for k,collection of App.collections
      collection.observer?.stop()
      collection.remove({})

Template.header.onRendered = ->

Template.header.events
  'click .sub-nav-toggle': View.toggleSubNav
  'click .link-logout': View.logout

Template.header.helpers
