define(['app'], function(app) {
  app.controller('DetailCtrl', ['$scope', '$location', 'api',
    function DetailCtrl($scope, $location, api) {

      $scope.loading = true;

      api.getView($location.search().path).then(function(item) {
        $scope.loading = false;

        $scope.item = item;
      }, function(err) {
        $scope.title = 'Can\'t load article';
        $scope.error = true;
        $scope.loading = false;

        console.error('An error occured!', err);
      });

    }
  ]);
});
