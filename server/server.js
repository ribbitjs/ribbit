const express = require('express');
const app = new express();
const fs = require('fs');
const path = require('path');

const React = require('react');
const reactDomServer = require('react-dom/server');
const renderToString = reactDomServer.renderToString;

import { StaticRouter } from 'react-router-dom';

const { exec } = require('child_process');
const appDir = process.argv[2];
const ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));

import App from '../dist/AppBuildFolder/App.js';
console.log(<App />);

app.get('/*', (req, res) => {
  const context = {};
  const url = req.url;
  const jsx = (
    <StaticRouter context={context} location={url}>
      <App />
    </StaticRouter>
  );
  const reactDom = renderToString(jsx);

  const html = htmlTemplate(reactDom);

  console.log('====');
  console.log(html);
  console.log('====');

  const file = url.replace(/\//g, 'x');

  fs.writeFile(`${file}.html`, html, err => {
    if (err) throw err;
    res.sendFile(path.join(__dirname + `/../${file}.html`));
  });
});

app.use(express.static(ribbitConfig.buildFolder));

function htmlTemplate(reactDom) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>

        <body>
            <div id="app">${reactDom}</div>
            <script src="./dist/main.js"></script>
        </body>
        </html>
    `;
}

// app.get('/', (req, res) => {
//   res.send('ribbit');
// });

app.listen(4000, () => {
  console.log('listening on port 4000');
});
