
  const ExtractTextPlugin = require("extract-text-webpack-plugin");
  const extractCSS = new ExtractTextPlugin("styles.min.css");
  module.exports = {
    output: {
      filename: './[name].js',
      libraryTarget: 'commonjs'
    },module: { rules:
   [ { test: /\.js$/,
       exclude: [ /node_modules/ ],
       use:
        { loader: 'babel-loader',
          options: { presets: [ '@babel/preset-env', '@babel/preset-react' ] } } },
     { test: /\.css$/,
       use:
        [ { loader:
             '/Users/brianhon/github/Projects/ribbit/node_modules/extract-text-webpack-plugin/dist/loader.js',
            options: { id: 1, omit: 0, remove: true } },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' } ] } ] },plugins:[extractCSS]}