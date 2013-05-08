# ffos-list-detail

A list/detail/view template for an Open Web App,
built using [AngularJS](http://angularjs.org/) and [RequireJS](http://requirejs.org/).

This app template was inspired by [Mortar](https://github.com/mozilla/mortar-list-detail),
but addresses the following issues:

1. It uses the HTML/CSS that all the system apps use as well,
    which means they're rock solid, and will have a native look 'nd feel.
    Also, there is [great documentation](http://buildingfirefoxos.com) available.
2. Modularization in views/controllers/services is nice.
    This means we can keep the code clean and structured.
3. By taking advantage of the view system of AngularJS we also get routing for free.
    Managing routing state by hand is not something enjoyable.

For animations we have used a modified version of [angular-mobile-nav](http://github.com/ajoslin/angular-mobile-nav),
where we adjusted the animations to be in line with the transitions from the FFOS Building Blocks.

[Check it out!](http://comoyo.github.com/ffos-list-detail)

# Prerequisites

* [Node.js](http://nodejs.org/)

# Start dev'ing!

* Clone this repository
* Run `git submodule update --init --recursive`
* Run `npm install`
* Start the integrated web server via `node server.js`

When running in the [Firefox OS Simulator](https://addons.mozilla.org/en-US/firefox/addon/firefox-os-simulator/)
enter `http://localhost:8081/manifest.webapp` in the textbox and press 'Add URL'.

# Good to know...

* When adding a new javascript file (a controller, a service, anything);
don't forget to add the file in the array in 'www/js/main.js'.
This way RequireJS knows that it should load the file.
* When adding new view templates only the templates in the root of 'www/views'
are cached. Subfolders aren't processed at the moment.
* When navigating around, please don't use normal links,
use the `ng-tap="$navigate.go('/my/url', 'slide')"` directive.
The second argument is either 'slide' or 'modal' depending on the animation,
and the third argument is `reverse`, set it to true if doing a backwards animation.
* In need of UI elements? [buildingfirefoxos.com](http://buildingfirefoxos.com) has them!

# Making a release build

The release build enables the following options:

* Javascript combination / minification
* CSS combination / minification
* Offline capabilities through Appcache
* AngularJS view caching with
    [script directives](http://docs.angularjs.org/api/ng.directive:script)

A total of three requests in now required to load the application, one HTML,
one CSS and one javascript request (excluding CSS for the UI library).

To start a release build, run `./build.sh`.

# Installing on the device / server without node.js

If you want to host this application from any static website,
or want to package the application to submit to the market place,
simply copy over the /www folder.
This contains all the static assets required to run the app.

If you want to run the release build of the app this way (and you should!),
first build the release files via `./build.sh` and then change the `launch_path`
in '/www/manifest.webapp' into `/index.release.html`.

# Dealing with offline

If you are building a release build of this application the application already
runs without an internet connection.
However, you will need to take the following things in consideration
when extending the application.

1. Add UI parts and images that you need to
    [/manifest.appcache](https://github.com/comoyo/ffos-list-detail/blob/master/www/manifest.appcache)
2. Views need to be put in the [/views](https://github.com/comoyo/ffos-list-detail/blob/master/www/views)
    directory. Subdirectories are not cached.
3. If you are developing in Chrome, you need to manually clear the appcache
    every time you updated the app in [chrome://appcache-internals](chrome://appcache-internals/).
    Firefox desktop and Firefox OS will auto-refresh the app if there is an internet connection.

## Dealing with offline and HTTP requests

This demo application has all data in memory. However we also have added options
to load data from a third party source and still keep your application
available offline.
Instead of doing requests through [$http](http://docs.angularjs.org/api/ng.$http),
we provide you with the `http` service (the APIs are compatible), that has an
extra option available: `idbCache`.

This option allows you to cache request responses in local storage, contrary to
AngularJS's default caching model that only caches in-memory.
This way you can cache requests over subsequent page loads.
The beauty of it is that if there is no internet connection,
everything can be loaded from cache, even when expiration time has passed.
This allows you full flexibility of updating data whenever there is a connection,
and still provide the user with an offline experience.

Here is code on how to use it:

```javascript
/**
 * This is an API service, that handles all communication with the backend
 */
define(['app'], function(app) {
  // we require http as a dependency
  app.factory('api', ['http', function(http) {
    // we have one method
    var api = {
      getIndex: function(forceSkipCache) {
        // get an example URL (same syntax as $http.get)
        return http.get('http://example.org/index', {
          // this is the cache configuration
          idbCache: {
            // the key under which we need to cache
            cacheKey: 'api.index',
            // expiration time in ms. from now (this is 5 minutes)
            // This is only obeyed if there is an internet connection!
            expiresInMs: 5 * 60 * 1000,
            // set to true to always go to the server
            // (if there is an internet connection, otherwise cache is still used)
            forceSkipCache: forceSkipCache
          }
        });
      }
    };

    return api;
  }]);
});
```

Now to cache sub-pages that the user hasn't viewed yet,
you can use the idbCache to already load them after page load.
When the user now clicks through, the data will be loaded from cache
and the overall experience of the application will be much better.

## Pre-loading images and other resources to be used with offline

As long as the correct expiration and cache control headers are set
(this is the case in this example application), you can preload images the way
you would normally do it, and these results will be cached in the normal HTTP cache
(also when there is no internet connection).

For example:

```javascript
var img = new Image();
img.src = someDataFromTheServer.image;

// or just set <img src=""> to something :-)
```
