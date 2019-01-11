"use strict";

var _reactRouterDom = require("react-router-dom");

var express = require('express');

var app = new express();

var fs = require('fs');

var path = require('path');

var React = require('react');

var reactDomServer = require("react-dom/server");

var renderToString = reactDomServer.renderToString;

var _require = require('child_process'),
    exec = _require.exec;

var appDir = process.argv[3];

var ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));

var reactApp;
var babelChild = exec("npx babel ".concat(appDir, "/").concat(ribbitConfig.appFile), {
  cwd: appDir
}, function () {
  console.log('Built this fucking file.');
});
babelChild.stdout.on('data', function (data) {
  process.stdout.write(data);
  var writeStream = fs.createWriteStream('ForeignApp.js');
  writeStream.write(data);
  writeStream.on('finish', function () {
    console.log('Finished writing file. Fuck.');
  });
});
babelChild.stderr.on('data', function (data) {
  process.stdout.write(data);
});
babelChild.stderr.on('exit', function (data) {
  process.stdout.write('im done');
});
app.get('/', function (req, res) {
  var context = {};
  var url = req.url;
  var jsx = React.createElement(_reactRouterDom.StaticRouter, {
    context: context,
    location: url
  }, React.createElement(App, null));
  var reactDom = renderToString(jsx);
  var html = htmlTemplate(reactDom);
  console.log('====');
  console.log(html);
  console.log('====');
  var file = url.replace(/\//g, 'x');
  fs.writeFile("".concat(file, ".html"), html, function (err) {
    if (err) throw err;
    res.sendFile(path.join(__dirname + "/../".concat(file, ".html")));
  });
});
app.use(express.static(ribbitConfig.buildFolder));

function htmlTemplate(reactDom) {
  return "\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset=\"utf-8\">\n            <title>React SSR</title>\n        </head>\n\n        <body>\n            <div id=\"app\">".concat(reactDom, "</div>\n            <script src=\"./dist/main.js\"></script>\n        </body>\n        </html>\n    ");
}

app.get('/', function (req, res) {
  res.send('ribbit');
}); // app.listen(4000, () => {
//     console.log('listening on port 4000');
// });