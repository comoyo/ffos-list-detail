define(['app'], function(app) {

  app.controller('DetailCtrl', ['$scope', '$location', 'http',

    function DetailCtrl($scope, $location, http) {

      var path = $location.search().path;

      var scrapey = 'http://scrapey2.herokuapp.com/c/jan/?url=';

      var req = http.get(scrapey + path);

      req.success(function(item) {
        $scope.item = item;
      });

    }
  ]);
});
