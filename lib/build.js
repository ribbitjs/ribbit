//start server
//send fetch request to '/'
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const path = require('path');


module.exports = {
    build: () => {
        const child = exec('npm run start-server', {
            cwd: __dirname
        }, () => {
            //send fetch to routes
            console.log('i should be fetching something')
        });

        child.stdout.once('connection', (data) => {
            console.log('i only run one time')
        });

        child.stdout.on('data', (data) => {
            process.stdout.write(data)
        });

        child.stderr.on('data', (data) => {
            process.stdout.write(data)
        });

        child.stderr.on('exit', (data) => {
            process.stdout.write('im done')
        });
    }
}

