define(['app'], function(app) {
  app.controller('ListCtrl', ['$scope', 'api',
    function ListCtrl($scope, api) {

      $scope.$on('shake', function() {
        navigator.vibrate(200);

        $scope.refresh(true);
        $scope.$apply();
      });

      $scope.hasMozApps = !!navigator.mozApps;

      if (navigator.mozApps) {
        var checkIfInstalled = navigator.mozApps.getSelf();
        checkIfInstalled.onsuccess = function() {
          $scope.isInstalled = !!checkIfInstalled.result;
          $scope.$apply();
        };
      }

      $scope.install = function() {
        var host = location.href.substring(0, location.href.lastIndexOf('/'));
        var manifestURL = host + '/manifest.webapp';
        var installApp = navigator.mozApps.install(manifestURL);
        installApp.onsuccess = function() {
          $scope.isInstalled = true;
          $scope.$apply();
        };
        installApp.onerror = function() {
          alert('Install failed\n\n:' + installApp.error.name);
        };
      };

      $scope.refresh = function(forceNoCache) {
        $scope.loading = true;

        return api.getIndex(forceNoCache).success(function(data) {
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
        }).error(function(data, status) {
          $scope.loading = false;
          console.error('An error occured', data, status);
        });
      };

      // we'll load our data from cache on load
      $scope.refresh();
    }
  ]);
});
