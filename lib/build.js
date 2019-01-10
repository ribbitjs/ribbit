//start server
//send fetch request to '/'
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const path = require('path');


// npm run start-server

process.chdir('/tmp')



module.exports = {

    build: () => {
        const child = exec(`npm run start-server ${process.env.PWD}`, {
            cwd: __dirname,
            stio: ['pipe', 'ipc']
        }, () => { });

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

