const fs = require('fs');
const path = require('path');
const util = require('util');

const genWebpackConfig = ribbitConfig => {
  const { webpackSettings } = ribbitConfig;
  const localWebpackPath = `${process.env.PWD}/webpack.config.js`;

  let finalWebpackString = `module.exports = {
    output: {
      filename: './[name].js',
      libraryTarget: 'commonjs'
    },`;

  for (const key in webpackSettings) {
    if (key !== 'entry' && key !== 'output') {
      finalWebpackString += `${key}: ${util.inspect(webpackSettings[key], {
        showHidden: false,
        depth: null
      })},`;
    }
  }

  finalWebpackString += `}`;

  console.log('Final webpack string', finalWebpackString);

  fs.writeFileSync(localWebpackPath, finalWebpackString);
};

module.exports = genWebpackConfig;
