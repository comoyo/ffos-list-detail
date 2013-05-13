
  define(['app'], function(app) {
    app.controller('ListCtrl',

      ['$scope', 'database', 'http',

        function ListCtrl($scope, database, http) {
          var scrapey = 'http://scrapey2.herokuapp.com/c/jan/?url=';

          var req = http.get(scrapey + 'http://api.cnn.com');

          req.success(function(data) {
            $scope.items = data.stories;
          });
        }
      ]);
  });

