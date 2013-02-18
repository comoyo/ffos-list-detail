/**
 * Add an item to the database.
 * This controller works in conjunction with the 'edit' view.
 */
function AddCtrl($scope, $routeParams, $navigate, database) {
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
    
    $navigate.go('/', 'modal', true);
  };
}

AddCtrl.$inject = ['$scope', '$routeParams', '$navigate', 'database'];
