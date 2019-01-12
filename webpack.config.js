// const HtmlWebPackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const appDir = process.argv[2];
const ribbitRoutes = require(path.join(appDir, '/ribbit.routes.json'));
const appFile = process.argv[3];

function buildEntryObj(routes, entry) {
  const store = {};
  store.fuck = entry;

  routes.forEach(e => {
    const route = e.route.slice(1);
    const component = e.component;

    if (route === '') {
      if (e.assetName) store[e.assetName] = `${appDir}${component.slice(1)}`;
      else store['home'] = `${appDir}${component.slice(1)}`;
    } else {
      store[route] = `${appDir}${component.slice(1)}`;
    }
  });

  console.log(store);
  return store;
}

const routes = buildEntryObj(ribbitRoutes, appFile);

module.exports = {
  mode: 'development',
  entry: {
    App: '/home/marlon/Desktop/webpack-games/src/components/App.js',
    home: '/home/marlon/Desktop/webpack-games/src/components/one.js',
    two: '/home/marlon/Desktop/webpack-games/src/components/two.js'
  },
  output: {
    filename: './[name].js',
    libraryTarget: 'commonjs'
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  }
};
