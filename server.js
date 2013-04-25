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
    if(req.url !== '/') return next();
    
    var index = 'index' + (isReleaseBuild ? '.release' : '') + '.html';
    
    fs.readFile('./www/' + index, 'utf8', function(err, data) {
      if(err) return next(err);
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
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
    
    data = data.replace(/"js\/main\.js"/, '"js/main-built.js"');
    data = data.replace(/"css\/main\.css"/, '"css/main-built.css"');
    
    fs.writeFile('./www/index.release.html', data, 'utf8', function(err) {
      if (err) return console.error('Writing release failed', err);
      
      setup();
    });
  });
}
else {
  setup();
}