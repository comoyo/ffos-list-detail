require.config({
  shim: {
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    }
  },
  paths: {
    jquery: 'components/jquery/jquery',
    angular: 'components/angular/angular',
    app: 'js/app'
  },
  baseUrl: '/'
});

(function() {
  function tryHoldReady() {
    if (!tryHoldReady.executed && window.jQuery) {
      window.jQuery.holdReady(true);
      tryHoldReady.executed = true;
    }
  }
  tryHoldReady();
  require.onResourceLoad = tryHoldReady;
  require([
    // dependencies
    'jquery',
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
  ], function() {
    // done loading
    jQuery.holdReady(false);
  });

})();
