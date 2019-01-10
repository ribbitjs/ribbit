const express = require('express');
const app = new express();
const fs = require('fs');
const events = require('events');
const path = require('path')
const React = require('react')
const reactDomServer = require("react-dom/server");
const renderToString = reactDomServer.renderToString;

const eventEmitter = new events.EventEmitter();

const { appDirectory } = require('../lib/build');

import { StaticRouter } from "react-router-dom";

// console.log('RUNING RIBBIT SERVER')

const appDir = process.argv[3]
console.log('=====ARGS======', appDir);


//import their app.js file
const ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));
console.log(ribbitConfig)
//run express static on their bundle js file

app.get('/', (req, res) => {
    res.send('ribbit')
})

app.listen(4000, () => {
    console.log('listening on port 4000');
    eventEmitter.emit('connection');
});