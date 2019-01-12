const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

// Extract CSS

// const htmlPlugin = new HtmlWebPackPlugin({
//   template: './src/index.html',
//   filename: './main.html'
// });

module.exports = {
  mode: 'development',
  entry: {
    App: ['/home/marlon/Desktop/webpack-games/src/components/App.js'],
    one: ['/home/marlon/Desktop/webpack-games/src/components/one.js'],
    two: ['/home/marlon/Desktop/webpack-games/src/components/two.js']
  },
  output: {
    filename: './AppBuildFolder/[name].js'
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
