/**
 * This module handles formatting and parsing the <input type='date'/> stuff
 * Angular doesn't seem to nicely bind this
 */
define(['app'], function(app) {
  var padLeft = function(input, padLength, char) {
    input = input.toString();
    return Array(padLength - input.length + 1).join(char || " ") + input;
  };
  
  app.factory('inputDateHandler', function() {
    return {
      format: function(d) {
        return d.getFullYear() 
          + '-' + padLeft(d.getMonth() + 1, 2, '0')
          + '-' + padLeft(d.getDate(), 2, '0');
      },
      parse: function(d) {
        return new Date(Date.parse(d));
      }
    };
  });
});