/* jshint: esnext: true */
/* global System */
"use strict";
FlowRouter.wait();

// FlowRouter.route('/', {
//   name: "home",
//   action: function() {
//     return console.log('test');
//   }
// });

Meteor.startup(function() {
  System.import('client/scripts/routes');
  FlowRouter.initialize();
});

