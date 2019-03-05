const build = require('./cli/commands/build.js');
const dependencies = require('./cli/commands/dependencies.js');
const init = require('./cli/commands/init');
const workspaces = require('./cli/commands/workspaces');

module.exports = {
  build,
  dependencies,
  init,
  workspaces
};
