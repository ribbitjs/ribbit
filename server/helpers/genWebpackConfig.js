const fs = require('fs');
const path = require('path');
const util = require('util');

const genWebpackConfig = webpackSettings => {
  const localWebpackPath = `${process.env.PWD}/webpack.config.js`;

  let finalWebpackString = `
  const ExtractTextPlugin = require("extract-text-webpack-plugin");
  const extractCSS = new ExtractTextPlugin("styles.min.css");
  module.exports = {
    output: {
      filename: './[name].js',
      libraryTarget: 'commonjs'
    },`;
  if (Object.keys(webpackSettings).length === 0) {
    finalWebpackString += `
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
          }
        },
        {
          test: /\.css$/,
          use: extractCSS.extract(["css-loader", "postcss-loader"])
        }
      ]
    }
    `;
  } else {
    for (const key in webpackSettings) {
      if (key !== 'entry' && key !== 'output') {
        finalWebpackString += `${key}: ${util.inspect(webpackSettings[key], {
          showHidden: false,
          depth: null
        })},`;
      }
    }
    finalWebpackString.replace('rules: [', `rules: [{
      test: /\.css$/,
      use: extractCSS.extract(["css-loader", "postcss-loader"])
    }`)
  }

  finalWebpackString += `}`;

  fs.writeFileSync(localWebpackPath, finalWebpackString);
};

module.exports = genWebpackConfig;
