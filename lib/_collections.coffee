@Accounts       = new Mongo.Collection('accounts', connection: null)
@Businesses     = new Mongo.Collection('businesses', connection: null)
@Conversations  = new Mongo.Collection('conversations', connection: null)
@Campaigns      = new Mongo.Collection('campaigns', connection: null)
@CountryTargets = new Mongo.Collection('country_targets', connection: null)
@RadiusTargets  = new Mongo.Collection('radius_targets', connection: null)
@Keyphrases     = new Mongo.Collection('keyphrases', connection: null)
@Images         = new Mongo.Collection('images', connection: null)
@Reports        = new Mongo.Collection('reports', connection: null)

App.Collections =
  accounts        : Accounts
  businesses      : Businesses
  conversations   : Conversations
  campaigns       : Campaigns
  country_targets : CountryTargets
  radius_targets  : RadiusTargets
  keyphrases      : Keyphrases
  images          : Images
  reports         : Reports

if Meteor.isClient
  Session.setDefault('loadMoreConvos', true)
  Conversations.loadMore = ->
    # Get Conversations
    dict = App.Dicts.Conversations
    business = Session.get('business')
    num_per_page = dict.get('numPerPage')
    order_by = dict.get('orderBy')
    keyphrases = Keyphrases.find({hidden: {$not: true}}).fetch().filter (x) ->
      Campaigns.findOne({id: x.campaign_id}).status is "active"
    if (business? and num_per_page? and order_by?)
      if keyphrases?.length
        API.Conversations.getAll
          business_id: business.id
          num_per_page: num_per_page
          status: 'awaiting_reply'
          order_by: order_by
          keyphrase_ids: keyphrases.map((kp) -> kp.id).join(',')
        ,
          success: (data, responseText, xhr) ->
            if data.length is 0
              Session.set('loadMoreConvos', false)
            # Stop observer, remove all current records, insert new records, start observer
            Conversations.replaceWith(data)
      else
        # Remove all local conversations in case all keyphrases are hidden
        Conversations._remove({})

Mongo.Collection.prototype.batchInsertWith = (docs, options) ->
  check(docs, Array)

  if options?.key
    docs.forEach (doc) =>
      doc[options.key] = options.value
  if options?.replace
    this.remove({})
  this.batchInsert docs

Mongo.Collection.prototype.replaceWith = (docs) ->
  check(docs, Array)

  this._remove({})
  this.batchInsert docs

Mongo.Collection.prototype._insert = Mongo.Collection.prototype.insert
Mongo.Collection.prototype.insert = (doc) ->
  check(doc, Object)

  this.startObserving()
  this._insert doc
  this.stopObserving()

Mongo.Collection.prototype._update = Mongo.Collection.prototype.update
Mongo.Collection.prototype.update = (selectors, modifiers, options, callback) ->
  check(selectors, Match.OneOf(Object, String))
  check(modifiers, Object)

  this.startObserving()
  this._update(selectors, modifiers, options if options, callback if callback)
  this.stopObserving()

Mongo.Collection.prototype._upsert = Mongo.Collection.prototype.upsert
Mongo.Collection.prototype.upsert = (selectors, modifiers, options, callback) ->
  check(selectors, Match.OneOf(Object, String))
  check(modifiers, Object)

  this.startObserving()
  this._upsert(selectors, modifiers, options if options, callback if callback)
  this.stopObserving()

Mongo.Collection.prototype._remove = Mongo.Collection.prototype.remove
Mongo.Collection.prototype.remove = (selectors, callback) ->
  check(selectors, Match.OneOf(Object, String))

  this.startObserving()
  this._remove(selectors, callback if callback)
  this.stopObserving()

Mongo.Collection.prototype.observeChangedCallback = (newDoc, oldDoc) ->
  changes = _.transform newDoc, (result, n, key) ->
    result[key] = n  unless _.isEqual(n, oldDoc[key])
  newKeys = _.difference(_.keys(newDoc), _.keys(oldDoc))
  newValues = _.pick(newDoc, newKeys)
  changes = _.extend(changes, newValues)
  changes.id = newDoc.id
  if changes.callbacks
    callbacks = changes.callbacks
    delete changes.callbacks
  API[_.capitalize(this._name)].update changes,
    error: (xhr, textStatus, error) =>
      delete oldDoc._id
      this._update(newDoc._id, {$set: oldDoc})
      callbacks?.error(xhr,textStatus,error)
    success: (data, statusText) =>
      callbacks?.success(data,statusText)

Mongo.Collection.prototype.stopObserving = ->
  this.observer?.stop()
  delete this.observer