define(['app'], function(app) {
  app.controller('ListCtrl', ['$scope', '$routeParams', '$location', 'database',
    function ListCtrl($scope, $routeParams, $location, database) {
      $scope.items = database.getItems();
    }
  ]);
});
