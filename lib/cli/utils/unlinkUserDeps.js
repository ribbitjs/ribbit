const fs = require('fs');
const path = require('path');

const unlinkUserDeps = (deps, appDir) => {
  for (const dep of deps) {
    const pathToRibbitDep = path.join(`${__dirname}/../../../node_modules/${dep}`);
    if (fs.lstatSync(pathToRibbitDep).isSymbolicLink()) {
      fs.unlinkSync(pathToRibbitDep);
    }
  }
};

module.exports = unlinkUserDeps;
