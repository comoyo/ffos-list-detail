define(['app'], function(app) {
  app.filter('newlines', function() {
    return function(text) {
      return !text ? '' : text.replace(/\n/g, '<br/>');
    };
  });
});
