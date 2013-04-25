require.config({
  shim: {
    'angular': {
      exports: 'angular'
    }
  },
  paths: {
    angular: 'components/angular/angular',
    app: 'js/app'
  },
  baseUrl: '/'
});

(function() {
  require([
    // dependencies
    'angular',

    // application
    'app',
    'js/mobile-nav.js',
    
    // services
    'js/services/database.js',
    'js/services/dates.js',
    
    // controllers
    'js/controllers/list.js',
    'js/controllers/add.js',
    'js/controllers/detail.js',
    'js/controllers/edit.js'
  ], function(angular) {
    angular.bootstrap(document, ['app']);
  });

})();
