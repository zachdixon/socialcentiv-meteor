/* global Package, Npm */
"use strict";

Package.describe({
    name: 'app-deps',
    version: '0.0.1',
    summary: 'Private package that loads NPM dependencies for the app',
    git: '',
    documentation: null
});

// NPM dependenices are listed here, with explicit versions. These can then be
// `required()`d in `client.browserify.js` and `server.js`.

Npm.depends({
    "classnames": "2.1.2",
    "moment": "2.10.6",
    "externalify": "0.1.0",
    "react-onclickoutside": "0.3.0"
});

// Note specific package versions embedded below as well.

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');
    api.use([
        'cosmos:browserify@0.4.0',
        'react@0.1.0',
    ], 'client');

    api.use([
        'universe:modules@0.4.1',
    ]);

    api.addFiles([
        'client.browserify.js',
        'client.browserify.options.json'
    ], 'client');

    api.addFiles([
        'server.js',
    ], 'server');

    api.addFiles([
        'main.import.jsx',
        'system-config.js'
    ]);

});
