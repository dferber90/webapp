//  webpack-dev-server --config bundling/webpack.config.dev.client.js --progress --colors --hot

var webpack = require('webpack')
var path = require('path')
var WebpackDevServer = require('webpack-dev-server')
var clientConfig = require('../webpack.config.dev.client.js')
var nodemon = require('nodemon')
var canContinue = require('../utils/canContinue.js')
var log = require('npmlog')
log.level = 'warn'

var keypress = require('keypress')

function registerRefreshListener() {
  keypress(process.stdin)
  process.stdin.on('keypress', function (ch, key) {
    if (key && key.name === 'p') {
      process.stdout.write('\n')
      bundleServer()
    }
  })
  process.stdin.resume()
  log.info('webpack', 'Press "p" to hot-patch the server')
}

// -----------------------------------------------------------------------------
// Server
// -----------------------------------------------------------------------------
var startedServer = false
function startServer() {
  nodemon({
    execMap: {
      js: 'node',
    },
    script: path.join(__dirname, '..', '..', 'build', 'main', 'server.js'),
    ignore: ['*'],
    watch: ['nothing/'],
    ext: 'noop',
  })

  nodemon
    .on('quit', () => log.info('nodemon', 'stopped server. bye'))
    .on('exit', () => log.info('nodemon', 'nodemon exited'))
    .on('crash', () => log.info('nodemon', 'nodemon crashed'))
    .on('stderr', () => log.info('nodemon', 'nodemon stderr'))
    .on('restart', () => log.info('nodemon', 'patched server'))
}

function bundleServer() {
  var serverConfig = require('../webpack.config.dev.server.js')
  var serverCompiler = webpack(serverConfig)
  var bundleStart

  serverCompiler.plugin('compile', function () {
    log.info('webpack', 'Bundling server...')
    bundleStart = Date.now()
  })

  serverCompiler.plugin('done', function () {
    log.info('webpack', 'Bundled server in ' + (Date.now() - bundleStart) + 'ms!')
    if (startedServer) {
      nodemon.restart()
    } else {
      startedServer = true
      startServer()

      registerRefreshListener()
    }
  })

  serverCompiler.run(function (err, stats) {
    canContinue('server', err, stats)
  })
}

// ----------------------------------------------------------------------------
// Client
// ----------------------------------------------------------------------------
var clientCompiler = webpack(clientConfig)
var bundleClientStart
clientCompiler.plugin('compile', function () {
  log.info('webpack', 'Bundling client...')
  bundleClientStart = Date.now()
})

clientCompiler.plugin('done', function (stats) {
  if (!canContinue('server', false, stats)) return
  log.info('webpack', 'Bundled client in ' + (Date.now() - bundleClientStart) + 'ms!')
  bundleServer()
})

var devServer = new WebpackDevServer(clientCompiler, {
  hot: true,
  historyApiFallback: false,
  contentBase: path.join('build', 'main'),
  publicPath: clientConfig.output.publicPath,
  stats: { colors: true },
  quiet: false,
  noInfo: true,
  proxy: {
    '*': 'http://localhost:3000',
  },
})
devServer.listen(8080)

// work around a weird nodemon bug where something was logged to the console
// even after the process exited
process.on('SIGINT', function (err) {
  if (err) console.log(err.stack)
  process.exit()
})
