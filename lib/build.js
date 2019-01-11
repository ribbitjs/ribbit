//start server
//send fetch request to '/'
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const path = require('path');

//nodemon --exec babel-node server/server.js localhost:4000
//npm run start-server ${process.env.PWD}

module.exports = {
  build: () => {
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

    child.stderr.on('exit', data => {
      process.stdout.write('im done');
    });
  }
};
