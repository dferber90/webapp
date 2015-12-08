var path = require('path')
var webpack = require('webpack')
var stats = require('./stats.js')

var buildFolder = path.join('build', 'main')

module.exports = {
  devtool: 'cheap-eval-source-map',
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
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      // 'webpack/hot/dev-server',
      // 'webpack-dev-server/client?http://localhost:8080',
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
    noParse: ['react', 'react-dom', 'moment'],
    loaders: [
      {
        test: /\.js$/,
        include: [ path.resolve(__dirname, '..', 'modules') ],
        loaders: ['react-hot', 'babel?cacheDirectory=true'],
      },
      { test: /\.less$/, loader: 'style!css?modules&localIdentName=[name]__[local]!less' },
      { test: /\.css$/, loader: 'style!css?modules&localIdentName=[name]__[local]' },
      { test: /\.(woff)$/, loader: 'url?limit=100000' },
      { test: /\.(png|jpg|jpeg|svg)$/, loader: 'url?limit=25000' },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      CLIENT: true,
      SERVER: false,
      DEVELOPMENT: true,
      PRODUCTION: false,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(/* preferEntry */true),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['react', 'vendor'],
      minChunks: Infinity,
    }),
    function() {
      this.plugin('done', function(statsData) {
        stats.save(statsData, 'memoryOnly')
      })
    },
  ],
}
