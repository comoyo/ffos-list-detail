/*global angular */
require.config({
  shim: {
    'angular': {
      exports: 'angular'
    },
    angularRoute: ['angular'],
    angularAnimate: ['angular'],
    deps: ['app']
  },
  paths: {
    app: 'js/app',
    angular: 'components/angular/angular',
    localforage: 'js/lib/localforage',
    angularRoute: 'components/angular-route/angular-route',
    angularAnimate: 'components/angular-animate/angular-animate'
  },
  baseUrl: ''
});

(function() {
  window.name = 'NG_DEFER_BOOTSTRAP!';

  console.time('requirejs');
  require([
    // application
    'app',

    // dependencies
    'angular',
    'angularRoute',
    'angularAnimate',
    'localforage',

    // services
    'js/services/database.js',
    'js/services/dates.js',
    'js/services/http-cache.js',
    'js/services/install.js',

    // controllers
    'js/controllers/list.js',
    'js/controllers/add.js',
    'js/controllers/detail.js',
    'js/controllers/edit.js',
    'js/controllers/credits.js'
  ], function() {
    console.timeEnd('requirejs');

    angular.bootstrap(document, ['app']);
  });

})();
