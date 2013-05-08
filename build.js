({
  baseUrl: './www',
  paths: {
    app: './js/app',
    angular: './components/angular/angular',
    requireLib: './components/requirejs/require'
  },
  include: ['requireLib'],
  name: 'js/main',
  out: 'www/js/main-built.js',
  optimize: 'uglify2'
})
