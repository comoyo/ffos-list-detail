({
    baseUrl: "./www",
    paths: {
      jquery: './components/jquery/jquery',
      angular: './components/angular/angular',
      app: './js/app'
    },
    name: "js/main",
    out: "www/js/main-built.js",
    optimize: "uglify2",
    uglify2: {
        output: {
            beautify: false
        },
        compress: {
            sequences: true,
            global_defs: {
                DEBUG: false
            }
        },
        mangle: false
    }
})