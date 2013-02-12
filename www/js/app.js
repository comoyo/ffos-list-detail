define(["angular"], function(angular) {
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

  app.controller('MainCtrl', function($scope, $navigate) {
    $scope.$navigate = $navigate;
    $navigate.go('/', 'none');
  });
  
  app.directive('ngClick', function() {
    var isTouch = !!('ontouchstart' in window);
    return function(scope, elm, attrs) {
      if (isTouch) {
        var tapping = false;
        elm.bind('touchstart', function() {
          tapping = true;
        });
        elm.bind('touchmove', function() {
          tapping = false;
        });
        elm.bind('touchend', function() {
          tapping && scope.$apply(attrs.ngClick);
        });
      }
      else {
        elm.bind('click', function() {
          scope.$apply(attrs.ngClick);
        });
      }
    };
  });

  return app;
});
