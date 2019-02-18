const path = require('path');

const composeFns = (f, g) => arg => f(g(arg));

const getPlugins = ({ pluginsArr, USER_PROJECT_DIRECTORY }) =>
  pluginsArr.reduce((acc, currPlugin) => {
    const { plugin, phase, module: phaseFn } = require(path.join(
      USER_PROJECT_DIRECTORY,
      `node_modules/${currPlugin}`
    ));

    if (!acc[phase]) {
      acc[phase] = {};
      acc[phase][phaseFn] = [];
    }
    acc[phase][phaseFn].push(plugin);
    return acc;
  }, {});

module.exports = {
  pipe: (fns = []) => fns.reduce(composeFns),
  getPlugins
};
