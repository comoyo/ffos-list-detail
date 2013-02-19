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

# Start dev'ing on OS/X or Linux

* Clone this repository
* Type: `bin/init.sh`
* Start the integrated web server via `node server.js`

# Start dev'ing on Windows

* Clone this repository
* Run `git submodule update --init --recursive`
* Run `npm install`
* Install bower via `npm install -g bower`
* Go into '/www' and run `bower install`
* Go up to the root, and start the integrated web server via `node server.js`

# Good to know...

* When adding a new javascript file (a controller, a service, anything);
don't forget to add the file in the array in 'www/js/main.js'.
This way RequireJS knows that it should load the file.
* When adding new view templates you might want to preload the view;
the list of views that are preloaded is maintained in 'www/js/app.js'.
* When navigating around, please don't use normal links,
use the `ng-tap="$navigate.go('/my/url', 'slide')"` directive.
The second argument is either 'slide' or 'modal' depending on the animation,
and the third argument is `reverse`, set it to true if doing a backwards animation.

# Making a release build

We can also do javascript combination and minification through RequireJS.
First build the combined js file via: `node r.js -o build.js`.
Now start the app with `node server.js release`.
