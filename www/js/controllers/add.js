function AddCtrl($scope, $routeParams, $location, database) {
  $scope.mode = 'new';
  $scope.title = 'New';
  $scope.item = {
    title: null,
    description: null,
    date: new Date()
  };
  
  $scope.save = function() {
    var obj = database.addItem($scope.item);
    console.log("Added", obj.id, "to database");
    
    $location.path('/');
  };
}

AddCtrl.$inject = ['$scope', '$routeParams', '$location', 'database'];
