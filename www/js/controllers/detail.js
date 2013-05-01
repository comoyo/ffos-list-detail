define(['app'], function(app) {
  app.controller('DetailCtrl', ['$scope', '$routeParams', 'database',
    function DetailCtrl($scope, $routeParams, database) {
      $scope.item = database.getItemById($routeParams.id);
    }
  ]);
});
