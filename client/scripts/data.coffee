# This file takes care of retrieving most of the data from the API
# Exceptions include: Conversations (TweetsPage)
# Each call is placed in a Tracker.autorun that automically reruns when its dependencies change
# The dependencies/reactive vars are usually the id needed for the api call
#   i.e. Session.get('currentUser') and its 'id' are needed to get the business(es)
# We then call `replaceWith()` on the corresponding collection to take care of
#   stopping/starting the observers, and replacing the data in those collections with the new data

Meteor.startup ->
  BO = "BusinessOwner"
  IP = "InteractiveProducer"
  AM = "AccountManager"
  ADMIN = "Admin"

  Tracker.autorun ->
    # Get Business for BusinessOwner
    user = Session.get('currentUser')
    if user? and user.type is BO
      API.Businesses.getAll
        user_id: user.id
      , (err, res) ->
        unless err
          Session.set('business', res.data[0])

  Tracker.autorun ->
    # Get Business for IPs
    user = Session.get('currentUser')
    business_id = Session.get('business_id')
    if user and (user.type is IP) and business_id
      API.Businesses.getSingle
        id: business_id
      , (err, res) ->
        unless err
          Session.set('business', res.data)

  Tracker.autorun ->
    # Get Campaigns
    business = Session.get('business')
    if business?
      API.Campaigns.getAll
        business_id: business.id
      , (err, res) ->
        unless err
          Campaigns.replaceWith(res.data)
          res.data.forEach (doc) ->
            campaign_id = doc.id
            # --------------------------------------
            # Get Country Targets for all campaigns
            API.CountryTargets.getAll
              campaign_id: campaign_id
            , (err, res) ->
              unless err
                CountryTargets.replaceWith(res.data, "campaign_id", campaign_id)
                # --------------------------------------
                # Get Radius Targets for all Country Targets
                res.data.forEach (doc) ->
                  country_target_id = doc.id
                  API.RadiusTargets.getAll
                    country_target_id: country_target_id
                  , (err, res) ->
                    unless err
                      RadiusTargets.replaceWith(res.data, "country_target_id", country_target_id)
            # --------------------------------------
            # Get Keyphrases for all campaigns
            API.Keyphrases.getAll
              campaign_id: campaign_id
            , (err, res) ->
              unless err
                Keyphrases.replaceWith(res.data, "campaign_id", campaign_id)
            # --------------------------------------
            # Get Images for all campaigns
            API.Images.getAll
              campaign_id: campaign_id
            , (err, res) ->
              unless err
                Images.replaceWith(res.data, "campaign_id", campaign_id)

  Tracker.autorun ->
    # Get accounts
    if Session.get('currentUser')?
      if Session.get('currentUser').type isnt "BusinessOwner"
        $.get "http://private-c3fb2-socialcentiv1.apiary-mock.com/managed_businesses.json", (res) ->
          if res.length
            Businesses.replaceWith(res)

  Tracker.autorun ->
    # Get Suggested Responses
    user = Session.get('currentUser')
    if user? and user.type is "BusinessOwner"
      API.SuggestedResponses.getAll {}, (err, res) ->
        unless err
          order = ["invite", "agree", "celebrate", "support", "sympathize"]
          sortedResults = []
          for sortedCategory in order
            for category in res
              if sortedCategory is category.category.toLowerCase()
                sortedResults.push category
          Session.set('suggestedResponses', sortedResults)
