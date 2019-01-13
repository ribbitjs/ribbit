const express = require('express');
const app = new express();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const React = require('react');
const { renderToString } = require('react-dom/server');
import { StaticRouter } from 'react-router-dom';

const appDir = process.argv[2];
const ribbitRoutes = require(path.join(appDir, '/ribbit.routes.json'));
const ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));
const appFile = `${appDir}/${ribbitConfig.app.slice(2)}`;
const webpackCommand = `npx webpack App=${appFile} `;

function buildCliCommand(command, routes) {
  routes.forEach(e => {
    if (e.assetName) {
      const pair = `${e.assetName}=${appDir}${e.component.slice(1)} `;
      command += pair;
    } else {
      if (e.route === '/') {
        const pair = `Home=${appDir}${e.component.slice(1)} `;
        command += pair;
      } else {
        const pair = `${e.route}=${appDir}${e.component.slice(1)} `;
        command += pair;
      }
    }
  });
  return command;
}

function buildRouteArray(routes) {
  const arr = [];
  routes.forEach(e => {
    arr.push(e.route);
  });
  return arr;
}

const routeArray = buildRouteArray(ribbitRoutes);
const cliCommand = buildCliCommand(webpackCommand, ribbitRoutes);

const webpackChild = exec(`${cliCommand}`, () => {
  console.log('Rebuilt user app locally');
});

webpackChild.on('data', data => {
  stdout.write(data);
});
webpackChild.stderr.on('data', data => {
  process.stdout.write(data);
});

webpackChild.stderr.on('exit', data => {
  process.stdout.write('im done');
});

//pass route an array of all routes from ribbit.routes
app.get(routeArray, (req, res) => {
  //bring in App from the file that ribbit webpack created
  const App = require(`../dist/App.js`).default;
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
  if (url === '/') url = 'Home';
  else url = url.slice(1);

  fs.writeFile(`${appDir}/ribbit.statics/${url}.html`, html, err => {
    if (err) throw err;
    //send file is just for our testing purposes
    // res.sendFile(path.join(__dirname + `/../${url}.html`));
    res.send('built static HTML');
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
