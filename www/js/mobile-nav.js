/*global angular */
/*
 * angular-mobile-nav by Andy Joslin
 * http://github.com/ajoslin/angular-mobile-nav
 * @license MIT License http://goo.gl/Z8Nlo
 */

define(["angular"], function() {
  angular.module('mobile-navigate', []);
  /*
   * $change
   * Service to transition between two elements
   */
  angular.module('mobile-navigate').factory('$change', ['$q', '$rootScope', function($q, $rootScope) {
    var transitionPresets = { //[nextClass, prevClass]
      //Modal: new page pops up, old page sits there until new page is over it
      'modal': ['modal', ''],
      'none': ['', '']
    }, defaultOptions = {
      'prefix': 'mb-'
    }, IN_CLASS = "in",
      OUT_CLASS = "out",
      REVERSE_CLASS = "reverse",
      DONE_CLASS = "done",
      ANIMATION_END = typeof(document.body.style.webkitBorderRadius) !== "undefined" 
        ? "webkitAnimationEnd"
        : "animationend";

    return function change(next, prev, transType, reverse, options, cb) {
      options = angular.extend(options || {}, defaultOptions);
      var nextTransClass;
      var prevTransClass;

      function buildClassString(classes) {
        var classStr = "";
        for (var i = 0, ii = classes.length; i < ii; i++) {
          if (classes[i].length) {
            classStr += " " + options.prefix + classes[i];
          }
        }
        return classStr;
      }

      //Convert a preset (eg 'modal') to its array of preset classes if it exists
      //else, just convert eg 'slide' to ['slide', 'slide'], so both elements get it
      //The array layout is [nextClass, prevClass]
      var transition = transitionPresets[transType] ? transitionPresets[transType] : [transType, transType];

      //Hack for white flash: z-index stops flash, offsetWidth thing forces z-index to apply
      next.css('z-index', '-100');
      next[0].offsetWidth += 0;

      var nextClasses = buildClassString([
      reverse ? OUT_CLASS : IN_CLASS, (nextTransClass = transition[reverse ? 1 : 0]),
      reverse && REVERSE_CLASS || '']).trim();

      var prevClasses;
      if (prev) {
        prevClasses = buildClassString([
        reverse ? IN_CLASS : OUT_CLASS, (prevTransClass = transition[reverse ? 0 : 1]),
        reverse && REVERSE_CLASS || '']);
      }
      
      setTimeout(function() {
        next.css('display', 'block');
        next.addClass(nextClasses);
        prev && prev.addClass(prevClasses);
        
        //Find which element (sometimes none) to bind for ending
        var boundElement;
        if (nextTransClass && nextTransClass.length) {
          (boundElement = next).bind(ANIMATION_END, done);
        } else if (prev && prevTransClass && prevTransClass.length) {
          (boundElement = prev).bind(ANIMATION_END, done);
        } else {
          then();
        }
        
        function done() {
          prev && prev.css('display', 'none');
          $rootScope.$apply(function() {
            then();
          });
        }
        
        function then() {
          cb();
          boundElement && boundElement.unbind(ANIMATION_END, done);
          next.removeClass(nextClasses);
          prev && prev.removeClass(prevClasses);
        }
      });

      next.css('z-index', '');
      next[0].offsetWidth += 0;
    };
  }]);

  angular.module('mobile-navigate').service('$navigate', ['$rootScope', '$location',

  function($rootScope, $location) {
    var self = this;

    function Page(path, transition) {
      this.transition = transition || 'slide';
    }

    function navigate(destination, source, isBack) {
      $rootScope.$broadcast('$pageTransitionStart', destination, source, isBack);
      self.current = self.next;
    }

    /*
     * Will listen for a route change success and call the selected callback
     * Only one listen is ever active, so if you press for example
     * /link1 then press back before /link1 is done, it will go listen for the back
     */
    self.onRouteSuccess = angular.noop; //default value
    $rootScope.$on('$routeChangeSuccess', function($event, next, last) {
      if (next.$route.redirectTo) return;
      self.onRouteSuccess($event, next, last);
    });

    self.go = function go(path, transition, reverse) {
      $location.path(path);
      //Wait for successful route change before actually doing stuff
      self.onRouteSuccess = function($event, next, last) {
        self.next = new Page(path, transition || next.$route.transition);
        navigate(self.next, self.current, !! reverse);
      };
    };
  }]);

  angular.module('mobile-navigate').directive('mobileView', ['$rootScope', '$compile', '$controller', '$route', '$change',

  function($rootScope, $compile, $controller, $route, $change) {
    function link(scope, viewElement, attrs) {
      function insertPage(page) {
        var current = $route.current;
        var locals = current && current.locals;

        page.element = angular.element("<div class='mb-page'>" + locals.$template + "</div>");
        page.element.css({ 'display': 'none' });

        page.scope = scope.$new();
        var contents = page.element.contents();
        if (current.controller) {
          locals.$scope = page.scope;
          page.controller = $controller(current.controller, locals);
          contents.data('$ngControllerController', page.controller);
        }

        $compile(contents)(page.scope);
        viewElement.append(page.element);
        page.scope.$emit('$viewContentLoaded');
        page.scope.$evalAsync(attrs.onLoad);
      }

      scope.$on('$pageTransitionStart', function transitionStart($event, dest, source, reverse) {
        function transition() {
          insertPage(dest);
          var _source = (source ? source.element : null);
          var _transition = dest.transition || source.transition;

          $change(dest.element, _source, _transition, reverse, null, function() {
            if (source) {
              $rootScope.$broadcast('$pageTransitionSuccess', dest, source);
              source.scope.$destroy();
              source.element.remove();
              source = undefined;
            }
          });
        }
        transition(dest, source, reverse);
      });
    }

    return {
      restrict: 'EA',
      link: link
    };
  }]);
});
