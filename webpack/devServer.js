// webpack-dev-server for client side part of app

/* eslint
  no-var: [0],
  vars-on-top: [0]
*/
var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var completeConfig = require('./webpack.config.js')
var fs = require('fs')
var path = require('path')

var webpackClientConfig = completeConfig[0]
var webpackServerConfig = completeConfig[1]

// piping only watches backend.js
var startedPiping = false
var pipingOptions = {
  hook: true,
  main: './build/backend.js'
}

var clientCompiler
var serverCompiler
var server

var handleFatalError = function (error) {
  console.error(error)
}

var handleSoftErrors = function (errors) {
  console.log(errors)
}

var handleWarnings = function (warnings) {
  console.warn(warnings)
}

var successfullyCompiled = function (stats, what) {
  // console.log(stats)
  fs.writeFileSync(
    path.join(__dirname, '..', 'build', what + '-manually.json'),
    JSON.stringify(stats, null, 4)
  )
  console.log('compiled ' + what)
}

/*
, function (err, stats) {
  var jsonStats
  if (err) {
    return handleFatalError(err)
  }
  jsonStats = stats.toJson()
  if(jsonStats.errors.length > 0) {
      return handleSoftErrors(jsonStats.errors)
  }
  if(jsonStats.warnings.length > 0) {
      handleWarnings(jsonStats.warnings)
  }
  successfullyCompiled(jsonStats, 'client')
}
 */

clientCompiler = webpack(webpackClientConfig)

server = new WebpackDevServer(clientCompiler, {
  // webpack-dev-server options
  // contentBase: "/path/to/directory",
  // or: contentBase: "http://localhost/",

  hot: true,
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a "webpackHotUpdate" message is send to
  // the content
  // Use "webpack/hot/dev-server" as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI
  // option does.

  // webpack-dev-middleware options

  // Display nothing to the console
  quiet: false,
  // Display no info to console (only warnings and errors)
  noInfo: true,
  // Switch into lazy mode
  // -> The compiler compiles on every request to the entry point.
  lazy: false,
  // In most cases this equals the webpack configuration
  // option output.filename
  filename: webpackClientConfig.output.filename,

  watchOptions: {
    // Delay the rebuilt after the first change. Value is a time in ms.
    aggregateTimeout: 300,

    // false or number: use polling with specified interval
    poll: 1000
  },

  // The path where to bind the middleware to the server.
  // In most cases this equals the webpack configuration option
  // output.publicPath.
  publicPath: webpackClientConfig.output.publicPath,

  // headers: { "X-Custom-Header": "yes" },

  // Output options for the stats.
  stats: { colors: true },

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: true,

  inline: false,

  // Set this if you want webpack-dev-server to delegate a single path to an
  // arbitrary server.
  // Use "*" to proxy all paths to the specified server.
  // This is useful if you want to get rid of 'http://localhost:8080/'
  // in script[src], and has many other use cases
  // (see https://github.com/webpack/webpack-dev-server/pull/127 ).
  proxy: {
    '*': 'http://localhost:3000'
  }
})

server.listen(8080, 'localhost', function () {})

serverCompiler = webpack(webpackServerConfig)
serverCompiler.watch({
  aggregateTimeout: 300, // wait so long for more changes
  poll: false // use polling instead of native watchers
}, function (err, stats) {
  var jsonStats
  if (err) {
    return handleFatalError(err)
  }
  jsonStats = stats.toJson()
  if(jsonStats.errors.length > 0) {
      return handleSoftErrors(jsonStats.errors)
  }
  if(jsonStats.warnings.length > 0) {
      handleWarnings(jsonStats.warnings)
  }
  successfullyCompiled(jsonStats, 'server')

  if (!startedPiping) {
    startedPiping = true
    if (require('piping')(pipingOptions)) {
      require('../build/backend.js')
    }
  }
})
