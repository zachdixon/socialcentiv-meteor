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

# Mongo.Collection.prototype.stealthBatchInsert = (docs, options) ->
#   check(docs, Array)

#   this.observer?.stop()
#   if options?.foreign_key
#     docs.forEach (doc) =>
#       doc[options.foreign_key] = options.foreign_key_value
#   if options?.replace
#     this.remove({})
#   this.batchInsert docs
#   this.startObserving()

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
Mongo.Collection.prototype.remove = (selectors) ->
  check(selectors, Match.OneOf(Object, String))

  this.startObserving()
  this._remove(selectors)
  this.stopObserving()

Mongo.Collection.prototype.observeChangedCallback = (newDoc, oldDoc) ->
  changes = _.transform oldDoc, (result, n, key) ->
    result[key] = n  unless _.isEqual(n, newDoc[key])
  newKeys = _.difference(_.keys(newDoc), _.keys(oldDoc))
  newValues = _.pick(newDoc, newKeys)
  changes = _.extend(changes, newValues)
  changes.id = newDoc.id
  API[_.capitalize(this._name)].update changes,
    error: (xhr, textStatus, error) =>
      delete oldDoc._id
      this.stealthUpdate(newDoc._id, {$set: oldDoc})

Mongo.Collection.prototype.stopObserving = ->
  this.observer?.stop()
  delete this.observer