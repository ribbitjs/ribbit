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
