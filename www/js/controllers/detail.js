define(['app'], function(app) {
  app.controller('DetailCtrl', ['$scope', '$location', 'api',
    function DetailCtrl($scope, $location, api) {

      $scope.loading = true;

      api.getView($location.search().path).success(function(item) {
        $scope.loading = false;

        $scope.item = item;
      }).error(function(data, status) {
        $scope.title = 'Can\'t load article';
        $scope.error = true;
        $scope.loading = false;

        console.error('An error occured!', data, status);
      });

    }
  ]);
});
