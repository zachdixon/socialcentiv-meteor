/* global Npm, Dependencies:true */

// Import client-side npm modules and put them into the Dependencies object.
// We can then access `Dependences` elsewhere in server-side code to use
// these modules.

Dependencies = {
    moment: Npm.require('moment')
};
