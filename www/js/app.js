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
    }]);

  app.controller('MainCtrl', ['$scope', '$navigate', '$location',
                            function($scope, $navigate, $location) {
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
