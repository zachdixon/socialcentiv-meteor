"use strict";

const PERMISSIONS = {
  BO: "BusinessOwner",
  IP: "InteractiveProducer",
  AM: "AccountManager",
  ADMIN: "Admin"
};

let policies = {};
policies[PERMISSIONS.BO] = {
  routes: {
    "managedAccounts": false,
    "accountTweets": false,
    "tweets": true
  }
};

policies[PERMISSIONS.IP] = {
  routes: {
    "managedAccounts": true,
    "accountTweets": true,
    "tweets": true
  }
};

export let permit = function(category, feature) {
  let user = Session.get('currentUser');
  let userType = user? user.type : null;
  if (policies[userType] && policies[userType][category] && policies[userType][category][feature]) {
    return policies[userType][category][feature];
  } else {
    return false;
  }
};

