/**
 * This is the server side component for the Firefox OS List/Detail app
 * It's only purpose at the moment is to serve static files.
 */
var http = require('http');
var connect = require('connect');
var path = require('path');

// the manifest file needs to be served with this mime type
connect.static.mime.define({'application/x-web-app-manifest+json': ['webapp']});

// create a simple server
var server = connect()
  .use(connect.static(path.join(__dirname, 'www')));

// and set up the server
var port = process.env.PORT || 8081;
var host = process.env.IP || '0.0.0.0';
http.createServer(server).listen(port, host);