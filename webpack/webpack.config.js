/* eslint
  no-var: [0],
  vars-on-top: [0]
*/

// webpack for building server-side code taken from
// http://jlongster.com/Backend-Apps-with-Webpack--Part-I
// http://jlongster.com/Backend-Apps-with-Webpack--Part-II
// http://jlongster.com/Backend-Apps-with-Webpack--Part-III

// basically the server creates backend.js,
// then piping in devServer.js watches for changes and restarts

var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var commonConfiguration = require('./commonConfiguration')

var rootPath = path.join(__dirname, '..')
var outputPath = path.join(rootPath, 'build', 'public', 'assets')
var clientBaseEntryPath = path.join(rootPath, 'app', 'client', 'client.js')
var serverEntryPath = path.join(rootPath, 'app', 'server', 'server.js')

var isInProduction = !!process.env.PRODUCTION
var includeDevTools = true

var babelStage0 = 'babel?stage=0'
var jsxLoader = {
  test: /\.js$/,
  loaders: isInProduction ? [babelStage0] : [ 'react-hot', babelStage0 ],
  // loaders: ['babel?stage=0'],
  exclude: /node_modules/
}

var hotReload = isInProduction ? [] : [
  'webpack-dev-server/client?http://0.0.0.0:8080',
  'webpack/hot/dev-server'
]


// We don't want to bundle in anything from node_modules
// on the server
// http://jlongster.com/Backend-Apps-with-Webpack--Part-I
var nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })


var serverPlugins = []
if (!isInProduction) {
  serverPlugins.push(new webpack.BannerPlugin(
    'require("source-map-support").install();',
    { raw: true, entryOnly: false }
  ))
}

var imageLoader = {
  test: /\.(png|jpg)$/,
  loader: 'url-loader?limit=8192',
  exclude: /node_modules/
}

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry: {
      app: hotReload.concat([clientBaseEntryPath])
    },
    output: {
      // The output directory as absolute path (required).
      path: outputPath,
      // The output.path from the view of the Javascript / HTML page.
      publicPath: '/assets/', // eg localhost:8080/assets/bundle.js
      // The filename of the entry chunk as relative path inside the output.path
      // directory.
      filename: '[name].entry.js',
      chunkFilename: '[name].chunk.js'
    },
    recordsPath: path.resolve(__dirname, '../records/client.json'),
    resolve: commonConfiguration.resolve,
    module: {
      loaders: [
        jsxLoader,
        {
          test: /\.css$/,
          loaders: [ 'style', 'css' ],
          exclude: /node_modules/
        },
        {
          test: /\.less$/,
          loaders: [ 'style', 'css', 'less' ],
          exclude: /node_modules/
        },
        imageLoader
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        __DEV__: !isInProduction,
        __CLIENT__: true,
        __SERVER__: false,
        __DEVTOOLS__: includeDevTools
      }),
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'commonsChunk',
        filename: 'commonsChunk.js'
      })
    ]
  },
  {
    name: 'server',
    target: 'node',
    entry: serverEntryPath,
    devtool: isInProduction ? false : '#source-map',
    output: {
      path: outputPath, // put images into build/public/assets
      filename: '../../backend.js', // put backend.js into 'build/backend.js'
      publicPath: '/assets/'
    },
    externals: nodeModules,
    node: {
      console: false,
      global: false,
      process: false,
      __dirname: true,
      __filename: true
    },
    recordsPath: path.resolve(__dirname, '../records/server.json'),
    resolve: commonConfiguration.resolve,
    module: {
      loaders: [
        jsxLoader,
        imageLoader
      ]
    },
    plugins: serverPlugins.concat([
      new webpack.DefinePlugin({
        __DEV__: !isInProduction,
        __CLIENT__: false,
        __SERVER__: true,
        __DEVTOOLS__: includeDevTools
      }),
      new webpack.IgnorePlugin(/\.(css|less)$/),
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      new webpack.NoErrorsPlugin()//,
      // not watching components enables HMR on client,
      // because the server does not restart when changing a component
      // BUT for some reason it is not necessary to exclude shared
      // code when using react-hot-loader, so we don't exclude it
      // new webpack.WatchIgnorePlugin([
      //   path.resolve(__dirname, '../app/common/components')
      // ])
    ])
  }
]
