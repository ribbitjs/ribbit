const { exec } = require('child_process');
const path = require('path');
const rimraf = require('rimraf');
const { linkUserDeps, unlinkUserDeps } = require('../utils/index');

const ribbitConfig = require(path.join(process.env.PWD, '/ribbit.config.js'));

function build() {
  linkUserDeps(ribbitConfig.dependencies, process.env.PWD);
  if (ribbitConfig.plugins.length) {
    linkUserDeps(ribbitConfig.plugins, process.env.PWD);
  }

  const child = exec(
    `npm run start-server ${process.env.PWD}`,
    {
      cwd: __dirname
    },
    () => {
      const TEMP_STATIC_FILE_FOLDER = `${__dirname}/../../../dist`;
      unlinkUserDeps(ribbitConfig.dependencies, process.env.PWD);
      if (ribbitConfig.plugins.length) {
        unlinkUserDeps(ribbitConfig.plugins, process.env.PWD);
      }
      rimraf(TEMP_STATIC_FILE_FOLDER, error => {
        if (error) process.stdout(error);
      });
    }
  );

  child.stdout.on('data', data => {
    process.stdout.write('working...');
  });

  child.stderr.on('data', data => {
    process.stdout.write('Error in build process...');
    process.kill(process.pid, 'SIGINT');
  });

  child.stderr.on('exit', data => {
    console.log('Error starting server: ', data);
  });
}

module.exports = build;
