/*global define */
"use strict";
define(["angular", "app"], function(angular, app) {
  app.factory('database', function() {

    var DB = function() {
      var items = [{
        id: 1,
        title: "Learn this template!",
        description: "This is a list-detail template. Learn more about it at its project page!",
        date: new Date(2013, 1, 3)
      }, {
        id: 2,
        title: "Make things",
        description: "Make this look like that",
        date: new Date(2013, 1, 1)
      }, {
        id: 3,
        title: "Move stuff",
        description: "Move this over there",
        date: new Date(2012, 11, 9)
      }];
      
      this.getItems = function() {
        return items;
      };
      
      this.getItemById = function(id) {
        return items.filter(function(item) {
          return item.id === Number(id);
        })[0];
      };
      
      this.addItem = function(obj) {
        obj.id = Math.max.apply(Math, items.map(function(i) { return i.id; })) + 1;
        items.push(obj);
        return obj;
      };
      
      this.editItem = function(id, newObj) {
        var oldObj = this.getItemById(id);
        oldObj.title = newObj.title;
        oldObj.description = newObj.description;
        oldObj.date = newObj.date;
        return oldObj;
      };
    };
    
    return new DB();
  });
});
