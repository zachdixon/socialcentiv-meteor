/* jshint: esnext: true */
/* global System */
"use strict";

/* override _ (underscore) to use lodash instead */
window._ = lodash;

FlowRouter.wait();

Meteor.startup(function() {
  System.import('client/lib/main').then(function(m1) {
    System.import('client/scripts/routes').then(function(m2) {
      FlowRouter.initialize();
    });
  });
});

