const express = require('express');
const app = new express();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const React = require('react');
const { renderToString } = require('react-dom/server');
import { StaticRouter } from 'react-router-dom';

const appDir = process.argv[2];
const ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));

// import App from '../dist/App.js';
//TO DO - make this require dynamic
console.log('====appdir===', appDir);
console.log('======appfile', ribbitConfig.app.slice(1));
const webpackChild = exec(`npx webpack ${appDir} ${appDir}${ribbitConfig.app.slice(1)}`, () => {
  console.log('Rebuilt user app locally');
  // const App = require(`../dist/App.js`).default;
});

webpackChild.on('data', data => {
  stdout.write(data);
});

// const App = require(`${appDir}/${ribbitConfig.appFile}`).default;

//pass route an array of all routes from ribbit.routes
app.get(['/', '/two'], (req, res) => {
  const context = {};
  let url = req.url;

  const jsx = (
    <StaticRouter context={context} location={url}>
      <App />
    </StaticRouter>
  );

  //turn this into render to stream
  //this is where jsx turns into html
  const reactDom = renderToString(jsx);

  //injects reactDom into html template
  const html = htmlTemplate(reactDom);

  //replaces slashes in the route with x's so we dont mess up file structure
  //can change x to whatever we wantf
  //test out creating file structure
  // const file = url.replace(/\//g, 'x');

  //write file to their file system
  // dynamic file extensions for html
  if (url === '/') url = 'App';
  else url = url.slice(1);

  fs.writeFile(`${url}.html`, html, err => {
    if (err) throw err;
    //send file is just for our testing purposes
    res.sendFile(path.join(__dirname + `/../${url}.html`));
  });
});

app.use(express.static(ribbitConfig.root));

// File name for bundle import needs to be dynamic (user input)
// User can choose whether to split JS imports per route or
// only use the main bundle
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
            <script src="${ribbitConfig.buildFolder}/main.js"></script>
        </body>
        </html>
    `;
}

app.listen(4000, () => {
  console.log('listening on port 4000');
});
