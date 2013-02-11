function EditCtrl($scope, $routeParams, $location, database) {
  $scope.mode = 'edit';
  $scope.title = 'Edit';
  $scope.item = database.getItemById($routeParams.id);
  
  $scope.save = function() {
    var obj = database.editItem($scope.item.id, $scope.item);
    console.log("Updated", obj.id);
    
    $location.path('/detail/' + obj.id);
  };
}

EditCtrl.$inject = ['$scope', '$routeParams', '$location', 'database'];
