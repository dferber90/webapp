var path = require('path')
var webpack = require('webpack')
var stats = require('./stats.js')
var getNodeModules = require('./utils/getNodeModules.js')
var nodeModules = getNodeModules()

var buildFolder = path.join('build', 'main')


module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),

  entry: [
    path.resolve(__dirname, '..', 'modules', 'server.js'),
  ],
  target: 'node',
  node: {
    console: true,
    global: false,
    __dirname: false,
    __filename: false,
  },
  recordsPath: path.join(__dirname, '..', buildFolder, 'records.json'),
  output: {
    path: path.resolve(__dirname, '..', buildFolder),
    pathinfo: true,
    filename: 'server.js',
    publicPath: '/assets/',
    libraryTarget: 'commonjs2',
  },
  externals: nodeModules,
  module: {
    noParse: ['react', 'react-dom', 'moment'],
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '..', 'modules')],
        loaders: ['babel?cacheDirectory=true'],
      },
      { test: /\.css$/, loader: './mySecondLoader.js!css?modules&localIdentName=[hash:base64]' },
      { test: /\.(png|woff)$/, loader: 'url?limit=1' },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true }),
    new webpack.DefinePlugin({
      CLIENT: false,
      SERVER: true,
      SERVER_API: false,
      DEVELOPMENT: false,
      PRODUCTION: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      API_SECRET: JSON.stringify(process.env.API_SECRET || 'MY_SUPER_API_SECRET'),
    }),
    new webpack.DefinePlugin({
      // STATS: JSON.stringify(stats.load('memoryOnly')),
      STATS: JSON.stringify(stats.load()),
    }),
  ],
}
