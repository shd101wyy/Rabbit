const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, 'build_entry/build.dev.js'),
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'js')],
        exclude: [/node_modules/],
        loader: 'babel'
      }, {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }, {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },
  devtool: 'eval',
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourcemap: false
    })
  ],
  target: "electron"
}