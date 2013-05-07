/*global define */
"use strict";
define(['app'], function(app) {
  app.factory('indexedDbCache', [function() {
    return {
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
      }
    };
  }]);

  app.factory('http', ['$http', 'indexedDbCache', '$q', '$rootScope',
      function($http, cache, $q, $rootScope) {
    var _http = $http;

    var fn = function(config) {
      var cacheable =  config.method.toLowerCase() === 'get';
      if (typeof config.idbCache !== 'object' || !cacheable) {
        return _http(config);
      }

      var cacheKey = config.idbCache.cacheKey;
      var expiresInMs = config.idbCache.expiresInMs;
      var forceSkipCache = config.idbCache.forceSkipCache;

      var def = $q.defer();

      var cacheItem = cache.getItem(cacheKey);
      if (!cacheItem || forceSkipCache) {
        var req = _http(config);
        req.success(function(data, status, headers) {
          var obj = {
            data: data,
            status: status,
            headers: headers
          };
          cache.setItem(cacheKey, obj, expiresInMs); // expires in 1 minute
          def.resolve(obj);
        });
        req.error(function(data, status, headers) {
          var fromCache = cache.getItemSkipExpiry(cacheKey);
          if (fromCache) {
            console.log('Reading expired version of', cacheKey, 'from cache');
            def.resolve(fromCache.value);
          }
          else {
            def.reject({
              data: data,
              status: status,
              headers: headers
            });
          }
        });
      }
      else {
        def.resolve(cacheItem);
      }

      def.promise.success = function(fn) {
        def.promise.then(function(response) {
          fn(response.data, response.status, response.headers, config);
          !$rootScope.$$phase && $rootScope.$apply();
        });
        return def.promise;
      };

      def.promise.error = function(fn) {
        def.promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, config);
          !$rootScope.$$phase && $rootScope.$apply();
        });
        return def.promise;
      };

      return def.promise;
    };

    (function createShortMethods() {
      [].slice.call(arguments).forEach(function(name) {
        fn[name] = function(url, config) {
          config = config || {};
          config.method = name;
          config.url = url;
          return fn(config);
        };
      });
    })('get', 'delete', 'head', 'jsonp');

    (function createShortMethodsWithData() {
      [].slice.call(arguments).forEach(function(name) {
        fn[name] = function(url, data, config) {
          config = config || {};
          config.method = name;
          config.url = url;
          config.data = data;
          return fn(config);
        };
      });
    })('post', 'put');

    return fn;
  }]);
});
