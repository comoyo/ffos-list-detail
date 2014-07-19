/**
 * This module attaches the `install` function to the rootScope
 */
define(['app'], function(app) {
  app.run(['$rootScope', function($rootScope) {

    // is the device capable of installing this app?
    $rootScope.hasMozApps = !!navigator.mozApps;

    // if we do, check if we're already installed
    if ('mozApps' in navigator) {
      var checkIfInstalled = navigator.mozApps.getSelf();
      checkIfInstalled.onsuccess = function() {
        $rootScope.isInstalled = !!checkIfInstalled.result;
        $rootScope.$apply();
      };
    }

    // this is installation logic
    $rootScope.install = function() {
      var host = location.href.replace(location.hash, '');
      host = host.substr(0, host.lastIndexOf('/'));
      var manifestURL = host + '/manifest.webapp';
      // you point mozApps.install to a manifest file
      var installApp = navigator.mozApps.install(manifestURL);
      installApp.onsuccess = function() {
        $rootScope.isInstalled = true;
        $rootScope.$apply();
      };
      installApp.onerror = function() {
        alert('Install failed\n\n:' + installApp.error.name);
      };
    };

  }]);
});
