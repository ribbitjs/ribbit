const { exec } = require('child_process');
const path = require('path');
const rimraf = require('rimraf');
const { linkUserDeps, unlinkUserDeps } = require('../utils/index');

function build() {
  const ribbitConfig = require(path.join(process.env.PWD, '/ribbit.config.js'));
  linkUserDeps(ribbitConfig.dependencies, process.env.PWD);
  const child = exec(
    `npm run start-server ${process.env.PWD}`,
    {
      cwd: __dirname
    },
    () => {
      const TEMP_STATIC_FILE_FOLDER = `${__dirname}/../../../dist`;
      unlinkUserDeps(ribbitConfig.dependencies, process.env.PWD);
      rimraf(TEMP_STATIC_FILE_FOLDER, error => {
        if (error) process.stdout(error);
      });
    }
  );

  child.stdout.on('data', data => {
    process.stdout.write(data);
  });

  child.stderr.on('data', data => {
    process.stdout.write(data);
  });

  child.stderr.on('exit', data => {
    console.log('Error starting server: ', data);
  });
}

module.exports = build;
