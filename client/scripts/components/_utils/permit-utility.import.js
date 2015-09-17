"use strict";

import {CONSTANTS} from 'client/scripts/constants';

let {IP,AM,ADMIN} = CONSTANTS;

let policies = {};
policies[IP] = {
  routes: {
    "managedAccounts": true,
    "accountTweets": true,
    "tweets": false
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

