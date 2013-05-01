({
    baseUrl: "./www",
    paths: {
      app: './js/app',
      angular: './components/angular/angular'
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