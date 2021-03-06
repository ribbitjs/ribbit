const path = require('path');

const USER_PROJECT_DIRECTORY = process.argv[2]; // current working directory (pwd)
const USER_RIBBIT_CONFIG = require(path.join(
  USER_PROJECT_DIRECTORY,
  '/ribbit.config.js'
));
const USER_RIBBIT_ROUTES = require(path.join(
  USER_PROJECT_DIRECTORY,
  `${USER_RIBBIT_CONFIG.appRoot}/ribbit.routes.json`
));

const USER_APP_BUNDLE_FILE = USER_RIBBIT_CONFIG.bundle;
const USER_APP_BUNDLE_DIRECTORY_NAME = USER_RIBBIT_CONFIG.bundleRoot;
const USER_APP_FILE = USER_RIBBIT_CONFIG.app;
const USER_APP_PARENT_DIRECTORY_NAME = USER_RIBBIT_CONFIG.appRoot;

const USER_APP_PARENT_DIRECTORY_PATH = `${USER_PROJECT_DIRECTORY}/${USER_APP_PARENT_DIRECTORY_NAME}`;
const USER_APP_PATH = `${USER_APP_PARENT_DIRECTORY_PATH}/${USER_RIBBIT_CONFIG.app}`;
const USER_BUNDLE_PARENT_DIRECTORY_PATH = `${USER_PROJECT_DIRECTORY}/${USER_APP_BUNDLE_DIRECTORY_NAME}`;
const USER_BUNDLE_PATH = `${USER_BUNDLE_PARENT_DIRECTORY_PATH}/${USER_APP_BUNDLE_FILE}`;

module.exports = {
  USER_PROJECT_DIRECTORY,
  USER_RIBBIT_CONFIG,
  USER_RIBBIT_ROUTES,
  config: USER_RIBBIT_CONFIG,
  routes: USER_RIBBIT_ROUTES,
  bundleFilename: USER_APP_BUNDLE_FILE,
  bundleParentDirectory: USER_APP_BUNDLE_DIRECTORY_NAME,
  bundleFilePath: USER_BUNDLE_PATH,
  bundleParentDirectoryPath: USER_APP_PARENT_DIRECTORY_PATH,
  appFilename: USER_APP_FILE,
  appParentDirectory: USER_APP_PARENT_DIRECTORY_NAME,
  appFilePath: USER_APP_PATH,
  appParentDirectoryPath: USER_BUNDLE_PARENT_DIRECTORY_PATH
};
