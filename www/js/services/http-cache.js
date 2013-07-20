/*global define asyncStorage */
'use strict';
define(['app'], function(app) {
  app.factory('indexedDbCache', ['$rootScope', function($rootScope) {
    return {
      getItemSkipExpiry: function(key, callback) {
        asyncStorage.getItem(key, callback);
      },

      getItem: function(key, callback) {
        var _cb = callback;
        callback = function() {
          _cb.apply(this, arguments);
          $rootScope.$apply();
        };

        this.getItemSkipExpiry(key, function(obj) {
          if (!obj)
            return callback(false);

          if (new Date(Date.parse(obj.expires)) < new Date())
            return callback(false);

          callback(obj.value);
        });
      },

      setItem: function(key, value, expiresInMs, callback) {
        asyncStorage.setItem(key, {
          expires: new Date(+new Date() + expiresInMs),
          value: value
        }, function() {
          callback();
          $rootScope.$apply();
        });
      }
    };
  }]);

  app.factory('http', ['$http', 'indexedDbCache', '$q', '$rootScope',
    function($http, cache, $q, $rootScope) {
      var _http = $http;

      var fn = function(config) {
        var cacheable = config.method.toLowerCase() === 'get';
        if (typeof config.idbCache !== 'object' || !cacheable) {
          return _http(config);
        }

        var cacheKey = config.idbCache.cacheKey;
        var expiresInMs = config.idbCache.expiresInMs;
        var forceSkipCache = config.idbCache.forceSkipCache;

        var def = $q.defer();

        cache.getItem(cacheKey, function(cacheItem) {
          if (!cacheItem || forceSkipCache) {
            var req = _http(config);
            req.success(function(data, status, headers) {
              var obj = {
                data: data,
                status: status,
                headers: headers()
              };
              cache.setItem(cacheKey, obj, expiresInMs, function() {
                def.resolve(obj);
              });
            });
            req.error(function(data, status, headers) {
              cache.getItemSkipExpiry(cacheKey, function(fromCache) {
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
            });
          }
          else {
            def.resolve(cacheItem);
          }
        });
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
