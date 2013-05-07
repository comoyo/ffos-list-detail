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
    'js/services/api.js',
    'js/services/http-cache.js',
    'js/services/shaking.js',

    // controllers
    'js/controllers/list.js',
    'js/controllers/detail.js',

    // filters
    'js/filters/newline.js'
  ], function() {
    console.timeEnd('requirejs');
    if (document.readyState === 'complete') {
      angular.bootstrap(document, ['app']);
    }
    else {
      document.addEventListener('load', function() {
        angular.bootstrap(document, ['app']);
      });
    }
  });

})();
