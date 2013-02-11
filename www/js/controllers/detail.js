function DetailCtrl($scope, $routeParams, $location, database) {
  $scope.item = database.getItemById($routeParams.id);
}

DetailCtrl.$inject = ['$scope', '$routeParams', '$location', 'database'];
