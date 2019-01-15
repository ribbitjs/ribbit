const { exec } = require('child_process');
const rimraf = require('rimraf');

function build() {
  const child = exec(
    `npm run start-server ${process.env.PWD}`,
    {
      cwd: __dirname
    },
    () => {}
  );

  child.stdout.on('data', data => {
    process.stdout.write(data);
  });

  child.stderr.on('data', data => {
    process.stdout.write(data);
  });

  child.stdout.on('finish', data => {
    rimraf(`${__dirname}/../../dist`, error => {
      if (error) process.stdout(error);
      process.kill(process.pid, 'SIGINT');
    });
  });

  child.stderr.on('exit', data => {
    console.log('Error starting server: ', data);
  });
}

module.exports = build;
