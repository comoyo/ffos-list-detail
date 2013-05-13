/*global angular */
define(['app'], function(app) {
  app.controller('EditCtrl', ['$scope', '$routeParams', '$navigate', 'database', 'inputDateHandler',
    function EditCtrl($scope, $routeParams, $navigate, database, inputDates) {
      $scope.mode = 'edit';
      $scope.title = 'Edit';
      // do deep copy because our own database is in-memory
      $scope.item = angular.copy(database.getItemById($routeParams.id));
      $scope.item.dateValue = inputDates.format($scope.item.date);

      $scope.save = function() {
        $scope.item.date = inputDates.parse($scope.item.dateValue);

        var obj = database.editItem($scope.item.id, $scope.item);
        console.log("Updated", obj.id);

        $navigate.go('/detail/' + obj.id, 'modal', true);
      };
    }
  ]);
});
