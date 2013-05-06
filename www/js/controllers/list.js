define(['app'], function(app) {
  app.controller('ListCtrl', ['$scope', 'api',
    function ListCtrl($scope, api) {

      $scope.$on('shake', function() {
        navigator.vibrate(200);

        $scope.refresh(true);
        $scope.$apply();
      });

      $scope.refresh = function(forceNoCache) {
        $scope.loading = true;

        return api.getIndex(forceNoCache).then(function(data) {
          $scope.loading = false;
          $scope.items = data.stories;

          // cache all items in our index!
          data.stories.forEach(function(story) {
            // we can just do this because there is no penalty
            // if an item was loaded before already, we wont reload
            // thanks to the cache
            api.getView(story.link).then(function(item) {
              if (item.image) {
                // also preload the images?
                var img = new Image();
                img.src = item.image;
              }
            });
          });

        }, function(err) {
          $scope.loading = false;
          console.error('An error occured', err);
        });
      };

      // we'll load our data from cache on load
      $scope.refresh();
    }
  ]);
});
