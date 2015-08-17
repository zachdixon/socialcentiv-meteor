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
    "accounts": false,
    "tweets": true
  },
  UI: {
    "suggested_responses": true
  }
};

policies[PERMISSIONS.IP] = {
  routes: {
    "accounts": true,
    "tweets": true
  },
  UI: {
    "suggested_responses": false
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

