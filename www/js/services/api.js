/*global define */
"use strict";
define(['app'], function(app) {
  app.factory('api', ['httpCache', function(httpCache) {
    var api = {
      getIndex: function(forceSkipCache) {
        return httpCache.getUrl(
          'http://scrapey2.herokuapp.com/c/jan/?url=http://api.cnn.com',
          'api.index',
          60 * 1000,
          forceSkipCache);
      },

      getView: function(path, forceSkipCache) {
       return httpCache.getUrl(
          'http://scrapey2.herokuapp.com/c/jan/?url=' + path,
          'api.view.' + path,
          5 * 60 * 1000,
          forceSkipCache);
      }
    };

    return api;
  }]);
});
