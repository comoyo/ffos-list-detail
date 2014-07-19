var fs = require('fs');
var execSync = require('exec-sync');
var rmrf = require("wrench").rmdirSyncRecursive;
var cpr = require("wrench").copyDirSyncRecursive;

var steps = 6;
var current = 0;
function printStep() {
  return '[' + (++current) + '/' + steps + ']';
}

var appcache = process.argv[2] === 'appcache';

console.log(printStep(), 'Building in', __dirname + '/dist', 'appcache: ' + appcache);

try {
  rmrf('./dist');
}
catch(ex) {
  // Swallow all the exceptions
}

console.log(printStep(), 'Copying from www');

cpr('./www', './dist');

console.log(printStep(), 'Minify CSS');

execSync('node r.js -o cssIn=dist/css/main.css out=dist/css/main-built.css');

console.log(printStep(), 'Minify JS');

execSync('node r.js -o require-config.js');

console.log(printStep(), 'Optimizing index.html');

var data = fs.readFileSync('./dist/index.html', 'utf8');

data = data.replace('<script defer src="components/requirejs/require.js" ' +
  'data-main="js/main.js"></script>',
  '<script defer src="js/main-built.js"></script>');
data = data.replace(/"css\/main\.css"/, '"css/main-built.css"');

if (appcache) {
  data = data.replace(
    '<html><!-- manifest="manifest.appcache" -->',
    '<html manifest="manifest.appcache">');
}

var allViews = fs.readdirSync('./dist/views')
  .map(function(f) {
    return './dist/views/' + f;
  })
  .filter(function(f) {
    return fs.statSync(f).isFile();
  })
  .map(function(f) {
    return '<script type="text/ng-template" id="' +
      f.replace('./dist/', '') + '">' +
        fs.readFileSync(f, 'utf8') +
      '</script>';
  });

data = data.replace('<!-- views -->', allViews.join('\n'));

fs.writeFileSync('./dist/index.html', data, 'utf8');

console.log(printStep(), 'Done, you can run', __dirname + '/dist/index.html');
