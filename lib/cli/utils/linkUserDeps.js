const fs = require('fs');
const path = require('path');

const linkUserDeps = (deps, appDir) => {
  for (const dep of deps) {
    const pathToRibbitDep = path.join(`${__dirname}/../../../node_modules/${dep}`);
    const pathToUserDep = `${appDir}/node_modules/${dep}`;
    if (!fs.existsSync(pathToRibbitDep)) {
      fs.symlinkSync(pathToUserDep, pathToRibbitDep, 'dir');
    }
  }
};

module.exports = linkUserDeps;
