var path = require('path')
var webpack = require('webpack')
var stats = require('./plugins/stats.js')

var buildFolder = path.join('build', 'main')

module.exports = {
  devtool: 'source-map',
  entry: {
    vendor: [
      'moment',
      'isomorphic-fetch',
    ],
    react: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'history',
      'redux-simple-router',
    ],
    app: [
      'babel-polyfill',
      path.resolve(__dirname, '..', 'modules', 'client.js'),
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', buildFolder, 'assets'),
    pathinfo: true,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/assets/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '..', 'modules')],
        loaders: ['babel?cacheDirectory=true'],
      },
      { test: /\.less$/, loader: 'style!css?modules&localIdentName=[hash:base64]!less' },
      { test: /\.css$/, loader: 'style!css?modules&localIdentName=[hash:base64]' },
      { test: /\.(woff)$/, loader: 'url?limit=100000' },
      { test: /\.(png|jpg|jpeg|svg)$/, loader: 'url?limit=25000' },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: false,
      PRODUCTION: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(/* preferEntry */true),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['react', 'vendor'],
      minChunks: Infinity,
    }),
    function () {
      this.plugin('done', function (statsData) {
        // stats.save(statsData, 'memoryOnly')
        stats.save(statsData)
      })
    },
  ],
}
