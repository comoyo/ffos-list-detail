/*global angular */
define(['angular'], function() {
  // this is where our app definition is
  var app = angular
    .module('app', ['ngRoute', 'ngAnimate'])
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
        .when('/credits', {
          templateUrl: 'views/credits.html',
          controller: 'CreditsCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }])
    .config(['$compileProvider', function($compileProvider) {
      // AngularJS doesn't trust app:// protocol by default, which is the protocol
      // Firefox OS uses for packaged apps
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);
    }])
    .config(['$parseProvider', function($parseProvider) {
      $parseProvider.unwrapPromises(true);
    }]);

  app.controller('MainCtrl', ['$scope', '$location', '$rootScope',
                            function($scope, $location, $rootScope) {
    // A go() function that also takes a pageAnimation
    $scope.go = function(path, pageAnimation) {
      $rootScope.viewTransition = pageAnimation;

      $location.path(path);
    };
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
