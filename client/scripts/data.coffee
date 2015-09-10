# This file takes care of retrieving most of the data from the API
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
    # Get list of users/accounts (Reply Pro/Enterprise) for current advanced user
    user = Session.get('currentUser')
    if user? and user.type isnt BO
      API.Users.getAll {},
        success: (data, responseText, xhr) ->
          Accounts.replaceWith(data)

  Tracker.autorun ->
    # Get businesses for IP
    # FIXME - when IP is on a business, and code is hotpushed, it refreshes and 
    # correctly loads that business, but when you go to the accounts page, it doesn't load the other businesses
    user = Session.get('currentUser')
    if user? and Session.get('currentUser').type isnt BO
      # $.get "http://private-c3fb2-socialcentiv1.apiary-mock.com/managed_businesses.json", (res) ->
      #   if res.length
      #     Businesses.replaceWith(res)
      API.Businesses.getAll {},
        success: (data, responseText, xhr) ->
          Businesses.replaceWith(data)

  Tracker.autorun ->
    # Get Business for BusinessOwner
    user = Session.get('currentUser')
    if user? and user.type is BO
      API.Businesses.getAll
        user_id: user.id
      ,
        success: (data, responseText, xhr) ->
          Businesses._update({id: data.id}, {$set: data[0]}, {upsert: true})
          Session.set('business', Businesses.findOne())

  Tracker.autorun ->
    # Get Business for IPs
    user = Session.get('currentUser')
    business_id = Session.get('business_id')
    if user and (user.type is IP) and business_id
      API.Businesses.getSingle
        id: business_id
      ,
        success: (data, responseText, xhr) ->
          # Update current business doc with full details
          # upsert in case of refresh and business doesn't exist yet
          Businesses._update({id: business_id}, {$set: data}, {upsert: true})
          Session.set('business', Businesses.findOne({id: data.id}))

  Tracker.autorun ->
    # Get Campaigns
    business = Session.get('business')
    if business?
      API.Campaigns.getAll
        business_id: business.id
      ,
        success: (data, responseText, xhr) ->
          Campaigns.replaceWith(data)
          country_target_requests = []
          radius_target_requests = []
          keyphrase_requests = []
          image_requests = []
          country_targets = []
          radius_targets = []
          keyphrases = []
          images = []
          data.forEach (doc) ->
            campaign_id = doc.id
            # --------------------------------------
            # Get Country Targets for all campaigns
            country_target_requests.push API.CountryTargets.getAll
              campaign_id: campaign_id
            ,
              success: (data, responseText, xhr) ->
                data.forEach (doc) ->
                  doc.campaign_id = campaign_id
                  country_targets.push(doc)
                # --------------------------------------
                # Get Radius Targets for all Country Targets
                data.forEach (doc) ->
                  country_target_id = doc.id
                  radius_target_requests.push API.RadiusTargets.getAll
                    country_target_id: country_target_id
                  ,
                    success: (data, responseText, xhr) ->
                      data.forEach (doc) ->
                        doc.campaign_id = campaign_id
                        radius_targets.push(doc)
            # --------------------------------------
            # Get Keyphrases for all campaigns
            keyphrase_requests.push API.Keyphrases.getAll
              campaign_id: campaign_id
            ,
              success: (data, responseText, xhr) ->
                data.forEach (doc) ->
                  doc.campaign_id = campaign_id
                  keyphrases.push(doc)
            # --------------------------------------
            # Get Images for all campaigns
            image_requests.push API.Images.getAll
              campaign_id: campaign_id
            ,
              success: (data, responseText, xhr) ->
                data.forEach (doc) ->
                  doc.campaign_id = campaign_id
                  images.push(doc)
          all_requests = country_target_requests
                          .concat(radius_target_requests)
                          .concat(keyphrase_requests)
                          .concat(image_requests)
          $.when.apply($, country_target_requests).then () -> CountryTargets.replaceWith(country_targets)
          $.when.apply($, radius_target_requests).then () -> RadiusTargets.replaceWith(radius_targets)
          $.when.apply($, keyphrase_requests).then () -> Keyphrases.replaceWith(keyphrases)
          $.when.apply($, image_requests).then () -> Images.replaceWith(images)
          $.when.apply($, all_requests).then () -> Session.set('loadMoreConvos', true)

  Tracker.autorun Conversations.loadMore

  Tracker.autorun ->
    # Get Suggested Responses
    user = Session.get('currentUser')
    if user? and user.type is "BusinessOwner"
      API.SuggestedResponses.getAll {},
        success: (data, responseText, xhr) ->
          order = ["invite", "agree", "celebrate", "support", "sympathize"]
          sortedResults = []
          for sortedCategory in order
            for category in data
              if sortedCategory is category.category.toLowerCase()
                sortedResults.push category
          Session.set('suggestedResponses', sortedResults)
