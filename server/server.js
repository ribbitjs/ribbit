// react imports
import { StaticRouter } from 'react-router-dom';

const React = require('react');

const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('isomorphic-fetch');

const app = express();

// User app directory is received from arguments
const appParentDirectory = process.argv[2];
const ribbitConfig = require(path.join(appParentDirectory, '/ribbit.config.js'));
const ribbitRoutes = require(path.join(
  appParentDirectory,
  `${ribbitConfig.appRoot}/ribbit.routes.json`
));

const appFile = `${appParentDirectory}/${ribbitConfig.appRoot}/${ribbitConfig.app}`;

// Helper functions imports
const buildRoutesCliCommand = require('./helpers/buildRoutesCliCommand');
const sendFetches = require('./helpers/sendFetches');
const linkUserDeps = require('./helpers/linkUserDeps');
const unlinkUserDeps = require('./helpers/unlinkUserDeps');
const genWebpackConfig = require('./helpers/genWebpackConfig');

// Middleware imports
const htmlTemplate = require('./controllers/htmlTemplate');
const writeFile = require('./controllers/writeFile');

const routeArray = ribbitRoutes.map(el => el.route);

//object with keys as routes and values as the corresponding asset name. used in write file.
const routeAndAssetName = ribbitRoutes.reduce((acc, curr) => {
  if (curr.assetName) {
    acc[curr.route] = curr.assetName;
  }
  return acc;
}, {});

linkUserDeps(ribbitConfig, appParentDirectory);
genWebpackConfig(ribbitConfig);

const webpackCommand = `npx webpack App=${appFile} `;
const routesCliCommand = buildRoutesCliCommand(
  webpackCommand,
  ribbitRoutes,
  appParentDirectory,
  ribbitConfig.appRoot
);

app.get(
  routeArray,
  (req, res, next) => {
    const CompiledApp = require(`../dist/App.js`).default;
    const context = {};
    let componentRoute = req.url;

    const jsx = (
      <StaticRouter context={context} location={componentRoute}>
        <CompiledApp />
      </StaticRouter>
    );

    if (componentRoute === '/') componentRoute = routesCliCommand.homeComponent;

    res.locals = {
      ...res.locals,
      appParentDirectory,
      componentRoute,
      jsx,
      routeAndAssetName
    };
    next();
  },
  htmlTemplate,
  writeFile
);
app.use(express.static(ribbitConfig.bundleRoot));

// Create a new child process, that executes the passed in 'cli command'
// Child starts webpack and copies components over to the Ribbit directory

const webpackChild = exec(`${routesCliCommand.command}`, () => {
  // start server in callback (after webpack finishes running)
  app.listen(4000, () => {
    console.log('Listening on port 4000');
    // Send fetch request to all routes
    const fetchArray = sendFetches(ribbitRoutes, 4000);

    Promise.all(fetchArray)
      .then(arrayOfRoutes => {
        const ribbitManifest = arrayOfRoutes.reduce((acc, curr) => {
          acc[curr[0]] = curr[1];
          return acc;
        }, {});

        fs.writeFileSync(
          `${appParentDirectory}/ribbit.manifest.json`,
          JSON.stringify(ribbitManifest)
        );
        unlinkUserDeps(ribbitConfig, appParentDirectory);
        process.kill(process.pid, 'SIGINT');
      })
      .catch();
  });
});

// We can remove these next 3 functions in production
webpackChild.on('data', data => {
  process.stdout.write(data);
});
webpackChild.stderr.on('data', data => {
  console.error('Error in webpack child:', data);
});
webpackChild.stderr.on('exit', data => {
  console.error('Webpack child exited with error:', data);
});
