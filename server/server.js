// react imports
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

const React = require('react');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('isomorphic-fetch');
const bodyParser = require('body-parser');
// const hasPreloadRan = require('../lib/api/hasPreloadRan.js');

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
genWebpackConfig(ribbitConfig.webpackSettings);

const webpackCommand = `npx webpack App=${appFile} `;
const routesCliCommand = buildRoutesCliCommand(
  webpackCommand,
  ribbitRoutes,
  appParentDirectory,
  ribbitConfig.appRoot
);

const preloadArray = [];

app.use(bodyParser.json());

app.get(['/preload-push', '/preload-pop'], (req, res) => {
  const arrayCommand = req.url.substring(req.url.lastIndexOf('-') + 1);
  if (arrayCommand === 'push') {
    preloadArray.push(1);
    res.end();
  } else if (arrayCommand === 'pop') {
    preloadArray.pop();
    res.end();
  }
});

app.get(
  routeArray,
  (req, res, next) => {
    const CompiledApp = require(`../dist/App.js`).default;

    //  user exports their store from wherever they created it
    // user must give the path to their store file
    const { store } = require(`../dist/App.js`);

    const context = { data: {}, head: [], req };
    let componentRoute = req.url;

    // pull state out of store
    const preLoadedState = store.getState();

    const jsx = (
      // wrap static router in redux Provider in order to user redux state
      <Provider store={store}>
        <StaticRouter context={context} location={componentRoute}>
          <CompiledApp />
        </StaticRouter>
      </Provider>
    );

    if (componentRoute === '/') componentRoute = routesCliCommand.homeComponent;

    res.locals = {
      ...res.locals,
      preLoadedState,
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

const webpackChild = exec(`${routesCliCommand.command}`, () => {
  app.listen(5000, () => {
    console.log('Listening on port 5000');
    const fetchArray = sendFetches(ribbitRoutes, 5000);
    Promise.all(fetchArray)
      .then(arrayOfRoutes => {
        const ribbitManifest = arrayOfRoutes.reduce((acc, curr) => {
          acc[curr[0]] = curr[1];
          return acc;
        }, {});

        ribbitManifest.static = `${ribbitConfig.bundleRoot.slice(1)}`;

        fs.writeFileSync(
          `${appParentDirectory}/ribbit.manifest.json`,
          JSON.stringify(ribbitManifest)
        );

        function killServer() {
          if (preloadArray.length === 0) {
            console.log('KILL THE SERVER GENTS!!!!');
            process.kill(process.pid, 'SIGINT');
          } else {
            console.log('NOT READY TO KILL SERVER');
            setTimeout(killServer, 500);
          }
        }
        killServer();
      })
      .catch(err => console.log(err));
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
