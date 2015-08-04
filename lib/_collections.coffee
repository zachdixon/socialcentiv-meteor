@Accounts       = new Mongo.Collection('accounts', connection: null)
@Businesses     = new Mongo.Collection('businesses', connection: null)
@Conversations  = new Mongo.Collection('conversations', connection: null)
@Campaigns      = new Mongo.Collection('campaigns', connection: null)
@Locations      = new Mongo.Collection('locations', connection: null)
@Keyphrases     = new Mongo.Collection('keyphrases', connection: null)
@Images         = new Mongo.Collection('images', connection: null)
@Reports        = new Mongo.Collection('reports', connection: null)

App.Collections =
  accounts      : Accounts
  businesses    : Businesses
  conversations : Conversations
  campaigns     : Campaigns
  locations     : Locations
  keyphrases    : Keyphrases
  images        : Images
  reports       : Reports