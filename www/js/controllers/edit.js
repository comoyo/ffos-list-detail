function EditCtrl($scope, $routeParams, $navigate, database, inputDates) {
  $scope.mode = 'edit';
  $scope.title = 'Edit';
  $scope.item = database.getItemById($routeParams.id);
  $scope.item.date = inputDates.format($scope.item.date);
  
  $scope.save = function() {
    $scope.item.date = inputDates.parse($scope.item.date);
    
    var obj = database.editItem($scope.item.id, $scope.item);
    console.log("Updated", obj.id);
    
    $navigate.go('/detail/' + obj.id, 'modal', true);
  };
}

EditCtrl.$inject = ['$scope', '$routeParams', '$navigate', 'database', 'inputDateHandler'];
