function ListCtrl($scope, $routeParams, $location, database) {
  $scope.items = database.getItems();
}

ListCtrl.$inject = ['$scope', '$routeParams', '$location', 'database'];
