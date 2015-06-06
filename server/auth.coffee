Meteor.startup ->
  basicAuth = new HttpBasicAuth("dixon","d1x0n")
  basicAuth.protect()