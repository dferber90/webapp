/* eslint
  no-var: [0],
  vars-on-top: [0]
*/
var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var commonConfiguration = require('./commonConfiguration')

var runMultiple = !!process.env.TEST_WATCHER
// set up environments for tests

var rootPath = path.join(__dirname, '..')
var outputPath = path.join(rootPath, 'build')
var clientEntryPath = path.join(rootPath, 'tests', 'client-env', 'run.js')
var serverEntryPath = path.join(rootPath, 'tests', 'server-env', 'run.js')

var watchOptions = {
  aggregateTimeout: 300,
  poll: false
}

var nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

// 1) client env
var clientCompiler = webpack({
  name: 'client',
  target: 'node',
  entry: clientEntryPath,
  output: {
    path: path.join(outputPath, 'tests'),
    publicPath: '/tests/',
    filename: 'client.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?stage=0'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
        exclude: /node_modules/
      }
    ]
  },
  externals: nodeModules,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
      __CLIENT__: true,
      __SERVER__: false,
      __DEVTOOLS__: false
    })
  ],
  resolve: commonConfiguration.resolve
})

// 2) server env
var serverCompiler = webpack({
  name: 'server',
  target: 'node',
  entry: serverEntryPath,
  output: {
    path: path.join(outputPath, 'tests'),
    publicPath: '/tests/',
    filename: 'server.js'
  },
  externals: nodeModules,
  node: {
    console: false,
    global: false,
    process: false,
    __dirname: true,
    __filename: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?stage=0'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
      __CLIENT__: false,
      __SERVER__: true,
      __DEVTOOLS__: false
    })
  ],
  resolve: commonConfiguration.resolve
})

// run generated test files
if (runMultiple) {
  var clientCompilerReady = false
  var serverCompilerReady = false
  clientCompiler.watch(watchOptions, function (err, stats) {
    if(err) return handleFatalError(err)
    var jsonStats = stats.toJson()
    if (jsonStats.errors.length > 0) {
      return handleSoftErrors(jsonStats.errors)
    }
    if (jsonStats.warnings.length > 0) {
      handleWarnings(jsonStats.warnings)
    }
    clientCompilerReady = true
    runIfBothCompilersReady()
  })
  serverCompiler.watch(watchOptions, function (err, stats) {
    if(err) return handleFatalError(err)
    var jsonStats = stats.toJson()
    if (jsonStats.errors.length > 0) {
      return handleSoftErrors(jsonStats.errors)
    }
    if (jsonStats.warnings.length > 0) {
      handleWarnings(jsonStats.warnings)
    }
    serverCompilerReady = true
    runIfBothCompilersReady()
  })
} else {
  clientCompiler.run(function (err, stats) {
    if(err) return handleFatalError(err)
    var jsonStats = stats.toJson()
    if (jsonStats.errors.length > 0) {
      return handleSoftErrors(jsonStats.errors)
    }
    if (jsonStats.warnings.length > 0) {
      handleWarnings(jsonStats.warnings)
    }
  })
  serverCompiler.run(function (err, stats) {
    if(err) return handleFatalError(err)
    var jsonStats = stats.toJson()
    if (jsonStats.errors.length > 0) {
      return handleSoftErrors(jsonStats.errors)
    }
    if (jsonStats.warnings.length > 0) {
      handleWarnings(jsonStats.warnings)
    }
  })
}


var startedPiping = false
var pipingOptions = { main: './webpack/run-bundled-tests.js', hook: true }
function runIfBothCompilersReady () {
  if (!startedPiping && clientCompilerReady && serverCompilerReady) {
    startedPiping = true
    if (require('piping')(pipingOptions)) {
      require('../webpack/run-bundled-tests.js')
    }
  }
}

// error reporting
function handleFatalError (err) {
  console.error(err)
}

function handleSoftErrors (errors) {
  console.error(errors)
}

function handleWarnings (warnings) {
  console.warn(warnings)
}

