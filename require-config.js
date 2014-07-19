({
  baseUrl: './dist',
  paths: {
    app: 'js/app',
    angular: 'components/angular/angular',
    localforage: 'js/lib/localforage',
    angularRoute: 'components/angular-route/angular-route',
    angularAnimate: 'components/angular-animate/angular-animate'
  },
  include: ['components/requirejs/require.js'],
  name: 'js/main',
  out: 'dist/js/main-built.js',
  optimize: 'uglify2'
})
