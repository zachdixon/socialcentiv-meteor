/* global System */

System.config({
  map: {
    'app-deps': System.normalizeSync('client/lib/main'),
    'TweetsPage': System.normalizeSync('client/scripts/components/tweets/tweets-page')
  }
});
