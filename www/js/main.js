/*global angular */
require.config({
  shim: {
    'angular': {
      exports: 'angular'
    }
  },
  paths: {
    app: 'js/app',
    angular: './components/angular/angular'
  },
  baseUrl: '/'
});

(function() {
  console.time('requirejs');
  require([
    // application
    'app',
    'js/mobile-nav.js',

    // dependencies
    'angular',

    // services
    'js/services/database.js',
    'js/services/dates.js',
    'js/services/http-cache.js',

    // controllers
    'js/controllers/list.js',
    'js/controllers/add.js',
    'js/controllers/detail.js',
    'js/controllers/edit.js'
  ], function() {
    console.timeEnd('requirejs');

    angular.bootstrap(document, ['app']);
  });

})();
