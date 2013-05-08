/**
 * This is the server side component for the Firefox OS List/Detail app
 * It's only purpose at the moment is to serve static files.
 */
var http = require('http');
var connect = require('connect');
var path = require('path');
var fs = require('fs');

var isReleaseBuild = process.argv[2] === 'release';

// the manifest file needs to be served with this mime type
connect.static.mime.define({'application/x-web-app-manifest+json': ['webapp']});
connect.static.mime.define({'text/cache-manifest': ['appcache']});

// create a simple server
var server = connect()
  // super simple templating for the index.html file
  .use(function(req, res, next) {
    if (req.url !== '/') return next();

    var index = 'index' + (isReleaseBuild ? '.release' : '') + '.html';

    fs.readFile('./www/' + index, 'utf8', function(err, data) {
      if (err) return next(err);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  })
  // serve the release version if we're running a release build
  .use(function(req, res, next) {
    if (!isReleaseBuild || req.url !== '/manifest.webapp')
      return next();

    fs.readFile('./www/manifest.webapp', 'utf8', function(err, data) {
      if (err) return next(err);

      data = data.replace('"launch_path": "/index.html",',
        '"launch_path": "/index.release.html",');

      res.writeHead(200, {
        'Content-Type': 'application/x-web-app-manifest+json'
      });
      res.end(data);
    });
  })

  .use(function(req, res, next) {
    // caching shared files (other files are cached thru appcache)
   if (req.url.indexOf('/shared/') === 0) {
      res.setHeader('Cache-Control', 'public, max-age=345600'); // 4 days
      res.setHeader('Expires', new Date(Date.now() + 345600000).toUTCString());
    }
    return next();
  })
  .use(connect.static(path.join(__dirname, 'www')));

function setup() {
  if (isReleaseBuild) {
    console.log('Running a release build');
  }
  // and set up the server
  var port = process.env.PORT || 8081;
  var host = process.env.IP || '0.0.0.0';
  http.createServer(server).listen(port, host);
  console.log('Server running at http://' + host + ':' + port);
}

if (isReleaseBuild) {
  fs.readFile('./www/index.html', 'utf8', function(err, data) {
    if (err) return console.error('Where is index.html?');

    data = data.replace('<script defer src="components/requirejs/require.js" ' +
      'data-main="js/main.js"></script>',
      '<script defer src="js/main-built.js"></script>');
    data = data.replace(/"css\/main\.css"/, '"css/main-built.css"');

    data = data.replace(
      '<html><!-- manifest="manifest.appcache" -->',
      '<html manifest="manifest.appcache">');

    var allViews = fs.readdirSync('./www/views')
      .map(function(f) {
        return './www/views/' + f;
      })
      .filter(function(f) {
        return fs.statSync(f).isFile();
      })
      .map(function(f) {
        return '<script type="text/ng-template" id="' +
          f.replace('./www/', '') + '">' +
            // @todo, properly escape this
            fs.readFileSync(f, 'utf8') +
          '</script>';
      });

    data = data.replace('<!-- views -->', allViews.join('\n'));

    fs.writeFile('./www/index.release.html', data, 'utf8', function(err) {
      if (err) return console.error('Writing release failed', err);

      setup();
    });
  });
}
else {
  setup();
}