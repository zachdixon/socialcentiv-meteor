Package.describe({
  summary: "Socialcentiv API Javascript Client"
});

Package.onUse(function (api) {
  api.use('livedata', 'server');
  api.use('jquery');
  api.addFiles('socialcentiv.js', 'client');
  if(api.export) {
    api.export('APIConfig', 'client');
    api.export('API', 'client');
  }
});