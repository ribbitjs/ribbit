// react imports
import { StaticRouter } from 'react-router-dom';

const React = require('react');

const express = require('express');
const path = require('path');
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
const { buildRoutesCliCommand } = require('./helpers/buildRoutesCliCommand');
const { sendFetches } = require('./helpers/sendFetches');

// Middleware imports
const { htmlTemplate } = require('./controllers/htmlTemplate');
const { writeFile } = require('./controllers/writeFile');

const routeArray = ribbitRoutes.map(el => el.route);
const webpackCommand = `npx webpack App=${appFile} `;
const routesCliCommand = buildRoutesCliCommand(
  webpackCommand,
  ribbitRoutes,
  appParentDirectory
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
    res.locals.appParentDirectory = appParentDirectory;
    res.locals.componentRoute = componentRoute;
    res.locals.jsx = jsx;
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
      .then(data => {
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
  process.stdout.write(data);
});
webpackChild.stderr.on('exit', data => {
  process.stdout.write('Static file generation was successful.');
});
