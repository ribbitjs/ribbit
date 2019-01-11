const express = require('express');
const app = new express();
const fs = require('fs');
const path = require('path');

const React = require('react');
const reactDomServer = require('react-dom/server');
const renderToString = reactDomServer.renderToString;
import { StaticRouter } from 'react-router-dom';

const { exec } = require('child_process');
const appDir = process.argv[2];
const ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));

// process.chdir(appDir);
// import ReactApp from '/home/marlon/Desktop/webpack-games/src/App.js';

const babelParser = require('@babel/parser');
const babelTraverse = require('@babel/traverse');
const { transformFromAst } = require('@babel/core');

let ReactApp;
const AppPath = '/home/marlon/Desktop/webpack-games/src/App.js';

function createAsset(fileName) {
  let getData = fs.readFileSync(AppPath, 'utf-8');

  let ast = babelParser.parse(getData, {
    sourceType: 'module'
  });

  const dependencies = [];

  let generateDependencies = babelTraverse.default(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    }
  });

  let { code } = transformFromAst(ast, null, {
    presets: ['@babel/env', '@babel/react'] //applying the presets it means converting to es5 code
  });

  return {
    fileName,
    dependencies,
    code
  };
}

function dependancyGraph(entry) {
  const initialAsset = createAsset(entry);
  //collecting all assets
  const assets = [initialAsset];

  for (const asset of assets) {
    const dirname = path.dirname(asset.fileName);

    asset.dependencies.forEach(relativePath => {
      // getting the extension name of file example .js
      const extname = path.extname(asset.fileName);

      //generating the absolute path
      const absolutePath = path.join(dirname, relativePath + extname);
      const childAsset = createAsset(absolutePath);
      childAsset.fileName = relativePath + extname;
      assets.push(childAsset);
    });
  }

  return assets;
}

function bundle(graph) {
  let modules = '';

  // for each module we are creating key-value pairs where
  // the key is the filename of that module and value is its code.

  graph.forEach(mod => {
    modules += `${JSON.stringify(mod.fileName.replace(/.js$/gi, ''))}: [
        function ( module, exports,require) {
          ${mod.code}
        }
      ],`;
  });

  // final thing is we are creating an Immediately invoking function expression
  //or IIFE where that function accepts the modules in its parameter.

  var result = `(function (modules) {
      function require(name) {
        const [fn] = modules[name];
        const module={},exports={};
        fn(module, exports,(name)=>require(name));
        return exports;
      }
      require("${AppPath}");
    })({${modules}})`;

  return result; //finally we are returning the IIFE with modules
}

const graph = dependancyGraph(AppPath);

fs.appendFile('transpiled.js', bundle(graph), err => {
  if (err) throw err;
  console.log('transpiled.js created');
});

// console.log(code);

// const babelChild = exec(
//   `npx babel ${appDir}/${ribbitConfig.appFile}`,
//   {
//     cwd: appDir
//   },
//   () => {
//     console.log('Finished building file.');
//     const reactApp = require('../ForeignApp.js');
//   }
// );

// babelChild.stdout.on('data', data => {
//   process.stdout.write(data);
//   let writeStream = fs.createWriteStream('ForeignApp.js');
//   writeStream.write(data);

//   writeStream.on('finish', () => {
//     console.log('Finished writing file.');
//   });
// });

// babelChild.stderr.on('data', data => {
//   process.stdout.write('Error in writing file: ', data);
// });

// babelChild.stderr.on('exit', data => {
//   process.stdout.write('Error writing file, exiting: ', data);
// });

app.get('/', (req, res) => {
  const context = {};
  const url = req.url;
  const jsx = (
    <StaticRouter context={context} location={url}>
      <App />
    </StaticRouter>
  );
  const reactDom = renderToString(jsx);

  const html = htmlTemplate(reactDom);

  console.log('====');
  console.log(html);
  console.log('====');

  const file = url.replace(/\//g, 'x');

  fs.writeFile(`${file}.html`, html, err => {
    if (err) throw err;
    res.sendFile(path.join(__dirname + `/../${file}.html`));
  });
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
            <div id="app">${reactDom}</div>
            <script src="./dist/main.js"></script>
        </body>
        </html>
    `;
}

app.get('/', (req, res) => {
  res.send('ribbit');
});

// app.listen(4000, () => {
//     console.log('listening on port 4000');
// });

// let writeStream = fs.createWriteStream('transpiled.js');
// writeStream.write(code);

// writeStream.on('finish', () => {
//   console.log('Finished writing file.');
//   ReactApp = require('transpiled.js');
//   makeJsx(ReactApp);
// });

// function makeJsx(App) {
//   const jsx = (
//     <StaticRouter context={context} location={url}>
//       <App />
//     </StaticRouter>
//   );

//   console.log('================', jsx);
// }
