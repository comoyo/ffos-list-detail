/*global define */
"use strict";
define(['app'], function(app) {
  app.factory('api', ['http', function(http) {
    var api = {
      getIndex: function(forceSkipCache) {
        return http.get('http://scrapey2.herokuapp.com/c/jan/?url=http://api.cnn.com', {
          idbCache: {
            cacheKey: 'api.index',
            expiresInMs: 60 * 1000,
            forceSkipCache: forceSkipCache
          }
        });
      },
      getView: function(path, forceSkipCache) {
       return http.get(
          'http://scrapey2.herokuapp.com/c/jan/?url=' + path, {
          idbCache: {
            cacheKey: 'api.view.' + path,
            expiresInMs: 5 * 60 * 1000,
            forceSkipCache: forceSkipCache
          }
        });
      }
    };

    return api;
  }]);
});
