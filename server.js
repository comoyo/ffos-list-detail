/**
 * This is the server side component for the Firefox OS Capture app
 * It mainly does:
 * 1. Serve static files
 */
var http = require('http');
var connect = require('connect');
var path = require('path');

connect.static.mime.define({'application/x-web-app-manifest+json': ['webapp']});

// create a simple server
var server = connect()
  .use(connect.static(path.join(__dirname, 'www')));

http.createServer(server).listen(process.env.PORT || 8081);