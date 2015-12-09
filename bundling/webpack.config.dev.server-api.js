var path = require('path')
var webpack = require('webpack')
var getNodeModules = require('./utils/getNodeModules.js')
var nodeModules = getNodeModules()

var buildFolder = path.join('build', 'api')


module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, '..', 'modules', 'server-api.js'),
  target: 'node',
  node: {
    console: true,
    global: false,
    __dirname: true,
    __filename: true,
  },
  recordsPath: path.join(__dirname, '..', buildFolder, 'records.json'),
  output: {
    path: path.resolve(__dirname, '..', buildFolder),
    pathinfo: true,
    filename: 'server-api.js',
    libraryTarget: 'commonjs2',
  },
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, '..', 'modules')],
        loaders: ['babel?cacheDirectory=true'],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.BannerPlugin('require("source-map-support").install();', { raw: true }),
    new webpack.DefinePlugin({
      CLIENT: false,
      SERVER: false,
      SERVER_API: true,
      DEVELOPMENT: true,
      PRODUCTION: false,
      API_SECRET: JSON.stringify(process.env.API_SECRET || 'MY_SUPER_API_SECRET'),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
}
