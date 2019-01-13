const build = require('./commands/build.js');
const dependencies = require('./commands/dependencies.js');
const init = require('./commands/init');
const workspaces = require('./commands/workspaces');

module.exports = {
  build,
  dependencies,
  init,
  workspaces
};
