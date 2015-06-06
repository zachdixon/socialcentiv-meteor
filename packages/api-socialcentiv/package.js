Package.describe({
  summary: "Socialcentiv API Javascript Client"
});

Package.onUse(function (api) {
  api.use('livedata', 'server');
  api.addFiles('socialcentiv.js', 'server');
  if(api.export) {
    api.export('API', 'server');
  }
});