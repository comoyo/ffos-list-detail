/*global angular */
define(["angular"], function() {
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
        .when('/detail/:id', {
          templateUrl: 'views/detail.html',
          controller: 'DetailCtrl'
        })
        .when('/add', {
          templateUrl: 'views/edit.html',
          controller: 'AddCtrl'
        })
        .when('/edit/:id', {
          templateUrl: 'views/edit.html',
          controller: 'EditCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }])
    .run(function($templateCache, $http) {
      // these are the items that we'll load into cache on app startup
      [
        'views/detail.html',
        'views/edit.html',
        'views/list.html'
      ].forEach(function(path) {
        $http.get(path, { cache:$templateCache });
      });
    });

  app.controller('MainCtrl', function($scope, $navigate) {
    $scope.$navigate = $navigate;
    $navigate.go((window.location.hash || '#/').substr(1), 'none');
  });
  
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
