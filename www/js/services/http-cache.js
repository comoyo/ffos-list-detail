/*global define */
"use strict";
define(['app'], function(app) {
  app.factory('httpCache', ['$http', '$q', function($http, $q) {

    var cache = {
      getItemSkipExpiry: function(key) {
        var obj = localStorage.getItem(key);
        if (!obj) return false;

        // we only do JSON here
        try {
          obj = JSON.parse(obj);
        }
        catch(ex) {
          console.error('getting item from cache that isnt json', obj);
          return false;
        }

        return obj;
      },

      getItem: function(key) {
        var obj = this.getItemSkipExpiry(key);
        if (!obj)
          return false;

        if (new Date(Date.parse(obj.expires)) < new Date())
          return false;

        return obj.value;
      },

      setItem: function(key, value, expiresInMs) {
        localStorage.setItem(key, JSON.stringify({
          expires: new Date(+new Date() + expiresInMs),
          value: value
        }));
      },

      getUrl: function(url, cacheKey, expiresInMs, forceSkipCache) {
        var def = $q.defer();

        var cacheItem = cache.getItem(cacheKey);
        if (!cacheItem || forceSkipCache) {
          var req = $http.get(url);
          req.success(function(obj) {
            cache.setItem(cacheKey, obj, expiresInMs); // expires in 1 minute
            def.resolve(obj);
          });
          req.error(function(err) {
            var fromCache = cache.getItemSkipExpiry(cacheKey);
            if (fromCache) {
              console.log('Reading expired version of', cacheKey, 'from cache');
              def.resolve(fromCache);
            }
            else {
              def.reject(err);
            }
          });
        }
        else {
          def.resolve(cacheItem);
        }

        return def.promise;
      }
    };

    return cache;
  }]);
});
