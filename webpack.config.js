const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin("styles.min.css");

module.exports = {
  output: {
    filename: './[name].js',
    libraryTarget: 'commonjs',
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
        test: /.jsx?$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: extractCSS.extract(["css-loader", "postcss-loader"])
      }
    ]
  },
  plugins: [extractCSS]
};
