function EditCtrl($scope, $routeParams, $navigate, database) {
  $scope.mode = 'edit';
  $scope.title = 'Edit';
  $scope.item = database.getItemById($routeParams.id);
  $scope.item.date = (function(d) { 
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
    })($scope.item.date);
  
  $scope.save = function() {
    $scope.item.date = new Date(Date($scope.item.date));
    
    var obj = database.editItem($scope.item.id, $scope.item);
    console.log("Updated", obj.id);
    
    $navigate.go('/detail/' + obj.id, 'modal', true);
  };
}

EditCtrl.$inject = ['$scope', '$routeParams', '$navigate', 'database'];
