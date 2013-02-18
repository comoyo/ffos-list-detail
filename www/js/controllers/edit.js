function EditCtrl($scope, $routeParams, $navigate, database) {
  $scope.mode = 'edit';
  $scope.title = 'Edit';
  $scope.item = database.getItemById($routeParams.id);
  
  $scope.save = function() {
    var obj = database.editItem($scope.item.id, $scope.item);
    console.log("Updated", obj.id);
    
    $navigate.go('/detail/' + obj.id, 'modal', true);
  };
}

EditCtrl.$inject = ['$scope', '$routeParams', '$navigate', 'database'];
