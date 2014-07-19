/*global define */
"use strict";
define(['app'], function(app) {
  /* Add a new factory called database, with a dependency on http */
  app.factory('database', ['http', function(http) {
    var getItems = function() {
      /* getItems makes a HTTP get call to github */
      return http.get('https://api.github.com/users/mozilla-b2g/repos', {
        // this is the cache configuration, we want to always cache requests
        // because it gives better UX. Plus when there is no internet, we can
        // get the data from cache and not break for the user...
        idbCache: {
          cacheKey: 'api.index',
          // expiration time in ms. from now (this is 5 minutes)
          // This is only obeyed if there is an internet connection!
          expiresInMs: 5 * 60 * 1000
        }
      }).then(function(res) {
        // Format it, sort it and map it to have the same format as our previous in mem dataset
        return res.data.sort(function(a, b) {
          return a.stargazers_count < b.stargazers_count;
        }).map(function(item) {
          return {
            title: item.name,
            description: item.description,
            id: item.name
          };
        });
      });
    };

    // Similar story but now for just one item
    var getItemById = function(id) {
      return http.get('https://api.github.com/repos/mozilla-b2g/device-flatfish', {
        idbCache: {
          cacheKey: 'api.detail.' + id,
          expiresInMs: 10 * 60 * 1000
        }
      }).then(function(res) {
        var repo = res.data;
        return {
          title: repo.name,
          description: repo.description,
          id: repo.name,
          date: new Date((repo.pushed_at || "").replace(/-/g,"/").replace(/[TZ]/g," "))
        };
      });
    };

    return {
      getItems: getItems,
      getItemById: getItemById
    };
  }]);
});
