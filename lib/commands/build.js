const { exec } = require('child_process');
const rimraf = require('rimraf');

function build() {
  const child = exec(
    `npm run start-server ${process.env.PWD}`,
    {
      cwd: __dirname
    },
    () => {
      const TEMP_STATIC_FILE_FOLDER = `${__dirname}/../../dist`;
      rimraf(TEMP_STATIC_FILE_FOLDER, error => {
        if (error) process.stdout(error);
        process.kill(process.pid, 'SIGINT');
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
