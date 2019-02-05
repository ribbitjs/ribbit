const jsxCompose = require('./jsxCompose');

module.exports = {
  execution: [{ presetName: 'jsxCompose', presetFn: jsxCompose }]
};
