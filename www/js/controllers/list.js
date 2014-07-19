define(['app'], function(app) {
  app.controller('ListCtrl', ['$scope', '$routeParams', 'database',
    function ListCtrl($scope, $routeParams, database) {
      $scope.items = database.getItems();
    }
  ]);
});
