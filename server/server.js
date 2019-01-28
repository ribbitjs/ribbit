const fs = require('fs');
const { exec } = require('child_process');
const express = require('express');
require('isomorphic-fetch');
const bodyParser = require('body-parser');

// Middleware imports
const { executeStream } = require('./middleware/executeStream');
const { serializeData } = require('./middleware/serializeData');
const renderHTML = require('./middleware/renderHTML');
const renderStaticFiles = require('./middleware/renderStaticFiles');

const {
  appFilePath,
  config,
  routes,
  USER_PROJECT_DIRECTORY
} = require('./consts/globals');

const globals = require('./consts/globals');

// Phase imports
const routing = require('./modules/routing');
const { preloadData } = require('./modules/serializing');
const { renderPort, writeStaticFiles } = require('./modules/rendering');

const genWebpackConfig = require('./modules/execution/genWebpackConfig'); // execution

const app = express();
app.use(bodyParser.json());

const buildRoutesCliCommand = require('./modules/execution/buildRoutesCliCommand'); // create webpack config

// ROUTING
// first param will receive getPhasePlugins('routing');
const routesData = routing([], { routeArr: routes, config: globals });
// ROUTING END!!!!

// SERIALIZING
const preloadArray = [];
preloadData(app, preloadArray);
// SERIEALIZING END!!!!

genWebpackConfig(config.webpackSettings); // execution

const webpackCommand = `npx webpack App=${appFilePath} `;
const routesCliCommand = buildRoutesCliCommand(
  webpackCommand,
  routes,
  USER_PROJECT_DIRECTORY,
  config.appRoot
);

app.get(
  routesData.routes,
  (req, res, next) => {
    res.locals = {
      routesCliCommand,
      appParentDirectory: USER_PROJECT_DIRECTORY,
      routeAndAssetName: routesData.assetRouteMap
    };
    next();
  },
  serializeData,
  executeStream,
  renderHTML,
  renderStaticFiles
);

app.use(express.static(config.bundleRoot));

const executeWebpack = exec(`${routesCliCommand.command}`, () => {
  app.listen(renderPort, async () => {
    writeStaticFiles(routes, renderPort, preloadArray);
  });
});

// We can remove these next 3 functions in production
executeWebpack.on('data', data => {
  process.stdout.write(data);
});
executeWebpack.stderr.on('data', data => {
  console.error('Error in webpack child:', data);
});
executeWebpack.stderr.on('exit', data => {
  console.error('Webpack child exited with error:', data);
});
