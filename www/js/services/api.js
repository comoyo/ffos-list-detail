/*global define */
'use strict';
define(['app'], function(app) {
  app.factory('api', ['http', function(http) {
    var prefix = 'http://scrapey2.herokuapp.com/c/jan/?url=';

    var api = {
      getIndex: function(forceSkipCache) {
        return http.get(prefix + 'http://api.cnn.com', {
          idbCache: {
            cacheKey: 'api.index',
            expiresInMs: 60 * 1000,
            forceSkipCache: forceSkipCache
          }
        });
      },
      getView: function(path, forceSkipCache) {
       return http.get(prefix + path, {
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
