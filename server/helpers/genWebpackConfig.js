const fs = require('fs');
const path = require('path');
const util = require('util');

const genWebpackConfig = webpackSettings => {
  const localWebpackPath = `${process.env.PWD}/webpack.config.js`;

  let finalWebpackString = `module.exports = {
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
  }

  finalWebpackString += `}`;

  fs.writeFileSync(localWebpackPath, finalWebpackString);
};

module.exports = genWebpackConfig;
