var path = require('path')
var webpack = require('webpack')
var apiConfig = require('./webpack.config.dev.server-api.js')
var nodemon = require('nodemon')
var canContinue = require('./utils/canContinue.js')
var log = require('npmlog')
log.level = 'warn'

var apiCompiler = webpack(apiConfig)
var bundleClientStart
apiCompiler.plugin('compile', function () {
  log.info('webpack', 'Bundling server-api...')
  bundleClientStart = Date.now()
})

var startedServer = false
apiCompiler.plugin('done', function (stats) {
  if (!canContinue('server-api', false, stats)) return
  log.info('webpack', 'Bundled server-api in ' + (Date.now() - bundleClientStart) + 'ms!')

  if (startedServer) {
    nodemon.restart()
  } else {
    nodemon({
      execMap: {
        js: 'node',
      },
      script: path.join(__dirname, '..', 'build', 'api', 'server-api.js'),
      ignore: ['*'],
      watch: ['nothing/'],
      ext: 'noop',
    })

    nodemon
      .on('quit', () => log.info('nodemon', 'server-api: stopped server. bye'))
      .on('exit', () => log.info('nodemon', 'server-api: nodemon exited'))
      .on('crash', () => log.info('nodemon', 'server-api: nodemon crashed'))
      .on('stderr', () => log.info('nodemon', 'server-api: nodemon stderr'))
      .on('restart', () => log.info('nodemon', 'server-api: restarted server'))

    startedServer = true
  }
})

apiCompiler.watch(
  { aggregateTimeout: 300 },
  function (err, stats) {
    canContinue('server-api', err, stats)
  }
)

// work around a weird nodemon bug where something was logged to the console
// even after the process exited
process.on('SIGINT', function (err) {
  if (err) console.log(err.stack)
  process.exit()
})
