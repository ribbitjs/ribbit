const express = require('express');
const app = new express();
const fs = require('fs');
const path = require('path')

const React = require('react')
const reactDomServer = require("react-dom/server");
const renderToString = reactDomServer.renderToString;
import { StaticRouter } from "react-router-dom";

const { exec } = require('child_process');
const appDir = process.argv[3]
const ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));
let reactApp;

const babelChild = exec(`npx babel ${appDir}/${ribbitConfig.appFile}`,
    {
        cwd: appDir,
    },
    () => {
        console.log('Finished building file.')
    }
);

babelChild.stdout.on('data', (data) => {
    process.stdout.write(data)
    let writeStream = fs.createWriteStream('ForeignApp.js');
    writeStream.write(data)
    writeStream.on('finish', () => {
        console.log('Finished writing file.')
    });
});

babelChild.stderr.on('data', (data) => {
    process.stdout.write(data)
});

babelChild.stderr.on('exit', (data) => {
    process.stdout.write('im done')
});


app.get('/', (req, res) => {
    const context = {};
    const url = req.url
    const jsx = (
        <StaticRouter context={context} location={url}>
            <App />
        </StaticRouter>
    );
    const reactDom = renderToString(jsx);

    const html = htmlTemplate(reactDom);

    console.log('====')
    console.log(html)
    console.log('====')

    const file = url.replace(/\//g, 'x');

    fs.writeFile(`${file}.html`, html, (err) => {
        if (err) throw err;
        res.sendFile(path.join(__dirname + `/../${file}.html`));

    })
});


app.use(express.static(ribbitConfig.buildFolder));

function htmlTemplate(reactDom) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>

        <body>
            <div id="app">${ reactDom}</div>
            <script src="./dist/main.js"></script>
        </body>
        </html>
    `;
}


app.get('/', (req, res) => {
    res.send('ribbit')
})

app.listen(4000, () => {
    console.log('listening on port 4000');
});
