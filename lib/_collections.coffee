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

Mongo.Collection.prototype.stealthBatchInsert = (docs, foreign_key, foreign_key_value) ->
  check(docs, Array)

  this.observer?.stop()
  docs.forEach (doc) =>
    if foreign_key
      doc[foreign_key] = foreign_key_value
  this.batchInsert docs
  this.startObserving()

Mongo.Collection.prototype.replaceWith = (docs) ->
  check(docs, Array)

  this.observer?.stop()
  this.remove({})
  this.batchInsert docs
  this.startObserving()

Mongo.Collection.prototype.stealthInsert = (doc) ->
  check(doc, Object)

  this.observer?.stop()
  this.insert doc
  this.startObserving()

Mongo.Collection.prototype.stealthUpdate = (selectors, modifiers) ->
  check(selectors, Match.OneOf(Object, String))
  check(modifiers, Object)

  this.observer?.stop()
  this.update(selectors, modifiers)
  this.startObserving()

Mongo.Collection.prototype.stealthRemove = (selectors) ->
  check(selectors, Match.OneOf(Object, String))

  this.observer?.stop()
  this.remove(selectors)
  this.startObserving()

Mongo.Collection.prototype.observeChangedCallback = (newDoc, oldDoc) ->
  changes = _.transform oldDoc, (result, n, key) ->
    result[key] = n  unless _.isEqual(n, newDoc[key])
  newKeys = _.difference(_.keys(newDoc), _.keys(oldDoc))
  newValues = _.pick(newDoc, newKeys)
  changes = _.extend(changes, newValues)
  changes.id = newDoc.id
  API[_.capitalize(this._name)].update changes, (err, res) =>
    if err
      delete oldDoc._id
      this.stealthUpdate(newDoc._id, {$set: oldDoc})