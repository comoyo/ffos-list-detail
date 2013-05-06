/*global angular */
define(['angular'], function() {
  // this is where our app definition is
  var app = angular
    .module('app', ['mobile-navigate'])
    .config(['$routeProvider', function($routeProvider) {
      // here we specify routes
      // which HTML and JS to execute when a certain route is requested
      $routeProvider
        .when('/', {
          templateUrl: 'views/list.html',
          controller: 'ListCtrl'
        })
        .when('/detail/', {
          templateUrl: 'views/detail.html',
          controller: 'DetailCtrl'
        })
    }])
    .run(['httpCache', '$templateCache', function(httpCache, $templateCache) {
      // these are the items that we'll load into cache on app startup
      [
        'views/detail.html',
        'views/list.html'
      ].forEach(function(path) {
        // we cache for 1 second here, because we want immediate refresh
        // (its mainly for offline usage)
        // on page reload. templateCache handles it for the lifecycle of this app
        httpCache.getUrl(path, 'views.' + path, 1 * 1000).then(function(data) {
          $templateCache.put(path, data);
        });
      });
    }]);

  app.controller('MainCtrl', ['$scope', '$navigate', '$location', function($scope, $navigate, $location) {
    $scope.$navigate = $navigate;
    var search = $location.search();
    $navigate.go($location.path(), 'none').search(search);
  }]);

  app.config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);

  // TouchStart is faster than click, that's why we add this here as a
  // directive. Use `ng-tap` in code rather than `ng-click`.
  app.directive('ngTap', function() {
    var isTouch = !!('ontouchstart' in window);
    return function(scope, elm, attrs) {
      // if there is no touch available, we'll fall back to click
      if (isTouch) {
        var tapping = false;
        elm.bind('touchstart', function() {
          tapping = true;
        });
        // prevent firing when someone is f.e. dragging
        elm.bind('touchmove', function() {
          tapping = false;
        });
        elm.bind('touchend', function() {
          tapping && scope.$apply(attrs.ngTap);
        });
      }
      else {
        elm.bind('click', function() {
          scope.$apply(attrs.ngTap);
        });
      }
    };
  });

  return app;
});
