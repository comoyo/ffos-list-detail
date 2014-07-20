# ffos-list-detail

A list/detail/view template for an Open Web App,
built using [AngularJS](http://angularjs.org/) and [RequireJS](http://requirejs.org/),
by [Jan Jongboom](http://janjongboom.com) from Telenor Digital.

This app template was inspired by [Mortar](https://github.com/mozilla/mortar-list-detail),
but addresses the following issues:

1. It uses the HTML/CSS that all the system apps use as well,
    which means they're rock solid, and will have a native look 'nd feel.
    Also, there is [great documentation](http://buildingfirefoxos.com) available.
2. Modularization in views/controllers/services is nice.
    This means we can keep the code clean and structured.
3. By taking advantage of the view system of AngularJS we also get routing for free.
    Managing routing state by hand is not something enjoyable.
4. Offline capabilties, the application itself will run without an internet connection as well;
    even if you are running it as a hosted application.
    Plus there are handlers available to cache 3rd party data.
5. Also works in Webkit browsers, so you can also use this template as general
    mobile app starting kit.

[Check it out!](http://janjongboom.com/ffos-list-detail/)

# Prerequisites

* [Node.js](http://nodejs.org/)

# Start dev'ing!

* Clone this repository
* Run `npm install`
* Run `./node_modules/bower/bin/bower install`
* Open `www/index.html`

When running in the [App Manager](https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager),
click 'Add packaged app', and point to the `www` folder.

# Good to know...

* When adding a new javascript file (a controller, a service, anything);
don't forget to add the file in the array in 'www/js/main.js'.
This way RequireJS knows that it should load the file.
* When adding new view templates only the templates in the root of 'www/views'
are cached. Subfolders aren't processed at the moment. (*PR welcome*)
* When navigating around, please don't use normal links,
use the `ng-tap="$navigate.go('/my/url', 'forward')"` directive.
The second argument can be 'forward', 'backward', 'popup', 'popdown' depending on the animation.
* In need of UI elements? [buildingfirefoxos.com](http://buildingfirefoxos.com) has them!

# Making a release build

The release build enables the following options:

* Javascript combination / minification
* CSS combination / minification
* Offline capabilities through Appcache
* AngularJS view caching with
    [script directives](http://docs.angularjs.org/api/ng.directive:script)

A total of three requests in now required to load the application, one HTML,
one CSS and one javascript request (excluding images of course).
First, choose whether you want a [packaged](https://developer.mozilla.org/en-US/Marketplace/Options/Packaged_apps)
or a [hosted](https://developer.mozilla.org/en-US/Marketplace/Options/Self_publishing) app.
The only difference between them is that a hosted app will contain an
[appcache](http://www.html5rocks.com/en/tutorials/appcache/beginner/) file for offline usage.
To build:

* Packaged app: `node build.js`
* Hosted app: `node build.js appcache`

The build will be outputted in the ./dist directory.

# Installing on the device / server

If you want to host this application from any static website,
just upload the content of the /dist folder to it.
The application will also work offline (if you built with appcache flag)

To run on a device, ZIP up the content of the /dist folder and publish to the marketplace,
or install through the app manager.

# Dealing with offline

If you are building a release build of this application the application already
runs without an internet connection.
However, you will need to take the following things in consideration
when extending the application.

1. Add CSS files as an @import rule in
    [css/main.css]((https://github.com/comoyo/ffos-list-detail/blob/master/css/main.css)
2. Add UI parts and images that you need to
    [manifest.appcache](https://github.com/comoyo/ffos-list-detail/blob/master/www/manifest.appcache)
3. Views need to be put in the [/views](https://github.com/comoyo/ffos-list-detail/blob/master/www/views)
    directory. Subdirectories are not cached.
4. The appcache will be updated everytime you do a build.
    Remember that appcache works by showing the old version first before updating,
    so you'll need to refresh to see the new version.

## Dealing with offline and HTTP requests

This demo application has all data in memory. However we also have added options
to load data from a third party source and still keep your application
available offline.
Instead of doing requests through [$http](http://docs.angularjs.org/api/ng.$http),
we provide you with the `http` service (the APIs are compatible), that has an
extra option available: `idbCache`.

This option allows you to cache request responses in indexedDB, contrary to
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

## Adding new view animations

If you want to add a new view animation you can do it completely in CSS.
We use keyframe animations through ng-animate to create the transitions.
The animations live in [css/app.css](https://github.com/comoyo/ffos-list-detail/blob/master/css/app.css),
and have the following format (you'll need to add the -webkit- fallbacks as well):

```css
/* The new view */
.main-view.ANIMATIONNAME.ng-enter {
  animation: openAnim 0.4s forwards;
}

/* The current view */
.main-view.ANIMATIONNAME.ng-leave {
  animation: closeAnim 0.4s forwards;
}

/* The new view gets pushed from the right (100%) to 0 */
@keyframes openAnim {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(0); }
}

/* The current view gets pushed from 0 to the left (-100%) */
@keyframes closeAnim {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
```

When the animation is done the element will be removed from the DOM so don't worry.
Now to use it from code, add somewhere in HTML:

```html
<a ng-tap="go('/path/to/somewhere', 'ANIMATIONNAME')">Click me</a>
```

or from your controller:

```javascript
$scope.go('/path/to/somewhere', 'ANIMATIONNAME');
```
