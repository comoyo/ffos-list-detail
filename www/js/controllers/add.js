/**
 * Add an item to the database.
 * This controller works in conjunction with the 'edit' view.
 */
define(['app'], function(app) {
  app.controller('AddCtrl', ['$scope', '$routeParams', '$navigate', 'database', 'inputDateHandler',
    function AddCtrl($scope, $routeParams, $navigate, database, inputDates) {
      $scope.mode = 'new';
      $scope.title = 'New';
      $scope.item = {
        title: null,
        description: null,
        dateValue: inputDates.format(new Date())
      };

      $scope.save = function() {
        $scope.item.date = inputDates.parse($scope.item.dateValue);

        var obj = database.addItem($scope.item);
        console.log("Added", obj.id, "to database");

        $navigate.go('/', 'modal', true);
      };
    }
  ]);
});
