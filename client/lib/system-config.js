/* global System */

System.config({
  map: {
    'app-deps': System.normalizeSync('client/lib/main'),
    'Constants': System.normalizeSync('client/scripts/constants'),
    // Utils
    'Authorize': System.normalizeSync('client/scripts/components/_utils/authorize'),
    'MeteorData': System.normalizeSync('client/scripts/components/_utils/meteor-data'),
    'ShowFor': System.normalizeSync('client/scripts/components/_utils/show-for'),
    'Permit': System.normalizeSync('client/scripts/components/_utils/permit-utility'),
    // Global
    'Link': System.normalizeSync('client/scripts/components/global/link'),
    // Pages
    'LoginPage': System.normalizeSync('client/scripts/components/sessions/login-page'),
    'AccountsPage': System.normalizeSync('client/scripts/components/accounts/accounts-page'),
    'TweetsPage': System.normalizeSync('client/scripts/components/tweets/tweets-page')
    // Components
  }
});
