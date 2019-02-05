const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const linkUserDeps = (deps, appDir) => {
  for (const dep of deps) {
    const pathToRibbitDep = path.join(`${__dirname}/../../../node_modules/${dep}`);
    const pathToUserDep = `${appDir}/node_modules/${dep}`;
    if (!fs.existsSync(pathToRibbitDep)) {
      fsExtra.ensureSymlinkSync(pathToUserDep, pathToRibbitDep, 'dir');
    }
  }
};

module.exports = linkUserDeps;
