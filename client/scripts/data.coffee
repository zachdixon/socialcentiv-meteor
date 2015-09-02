# This file takes care of retrieving most of the data from the API
# Exceptions include: Conversations (TweetsPage)
# Each call is placed in a Tracker.autorun that automically reruns when its dependencies change
# The dependencies/reactive vars are usually the id needed for the api call
#   i.e. Session.get('currentUser') and its 'id' are needed to get the business(es)
# We then call `replaceWith()` on the corresponding collection to take care of
#   stopping/starting the observers, and replacing the data in those collections with the new data

# TODO
# - Make one .batchInsert call when all requests are done using $.when/$.then
#   i.e. if there are 4 campaigns, we'll make 4 requests each to get all the keyphrases/country_targets/radius_targets/images
#   we want to make 1 batchInsert for each of those resources

Meteor.startup ->
  BO = "BusinessOwner"
  IP = "InteractiveProducer"
  AM = "AccountManager"
  ADMIN = "Admin"

  Tracker.autorun ->
    # Get list of users/accounts (Reply Pro/Enterprise) for current advanced user
    user = Session.get('currentUser')
    if user? and user.type isnt BO
      API.Users.getAll {}, (err,res) ->
        unless err
          Accounts.replaceWith(res.data)

  Tracker.autorun ->
    # Get businesses for IP
    user = Session.get('currentUser')
    if user? and Session.get('currentUser').type isnt BO
      # $.get "http://private-c3fb2-socialcentiv1.apiary-mock.com/managed_businesses.json", (res) ->
      #   if res.length
      #     Businesses.replaceWith(res)
      API.Businesses.getAll {}, (err,res) ->
        unless err
          Businesses.replaceWith(res.data)

  Tracker.autorun ->
    # Get Business for BusinessOwner
    user = Session.get('currentUser')
    if user? and user.type is BO
      API.Businesses.getAll
        user_id: user.id
      , (err, res) ->
        unless err
          Businesses.replaceWith(res.data)
          Session.set('business', Businesses.findOne())

  Tracker.autorun ->
    # Get Business for IPs
    user = Session.get('currentUser')
    business_id = Session.get('business_id')
    if user and (user.type is IP) and business_id
      API.Businesses.getSingle
        id: business_id
      , (err, res) ->
        unless err
          Businesses.stealthInsert(res.data)
          Session.set('business', Businesses.findOne({id: res.data.id}))

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
                CountryTargets.stealthBatchInsert(res.data, "campaign_id", campaign_id)
                # --------------------------------------
                # Get Radius Targets for all Country Targets
                res.data.forEach (doc) ->
                  country_target_id = doc.id
                  API.RadiusTargets.getAll
                    country_target_id: country_target_id
                  , (err, res) ->
                    unless err
                      RadiusTargets.stealthBatchInsert(res.data, "country_target_id", country_target_id)
            # --------------------------------------
            # Get Keyphrases for all campaigns
            API.Keyphrases.getAll
              campaign_id: campaign_id
            , (err, res) ->
              unless err
                Keyphrases.stealthBatchInsert(res.data, "campaign_id", campaign_id)
            # --------------------------------------
            # Get Images for all campaigns
            API.Images.getAll
              campaign_id: campaign_id
            , (err, res) ->
              unless err
                Images.stealthBatchInsert(res.data, "campaign_id", campaign_id)

  Tracker.autorun ->
    # Get Conversations
    dict = App.Dicts.Conversations
    business = Session.get('business')
    num_per_page = dict.get('numPerPage')
    order_by = dict.get('orderBy')
    keyphrases = Keyphrases.find().fetch()

    if (business? and num_per_page? and order_by? and keyphrases?)
      API.Conversations.getAll
        business_id: business.id
        num_per_page: num_per_page
        status: 'awaiting_reply'
        order_by: order_by
        keyphrase_ids: keyphrases.map((kp) -> unless kp.hidden then kp.id).join(',')
      , (err, res) ->
        if (res and not err)
          # Stop observer, remove all current records, insert new records, start observer
          Conversations.replaceWith(res.data)

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
