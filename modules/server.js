const path = require('path')
const express = require('express')
const compress = require('compression')
const cookieParser = require('cookie-parser')
const log = require('./log/server.js')
const handleRequest = require('./utils/handleRequest.js')
const { createRethinkDBConnection } = require('./db/rethinkdb')
require('static!./images/favicon.ico?output=../public/favicon.ico')

const PORT = process.env.PORT || 3000

const app = express()
app.use(compress()) // should be first middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(createRethinkDBConnection)

if (DEVELOPMENT) {
  require('./utils/createDevelopmentProxy')(app)
} else {
  // STATS.publicPath = '/assets/'
  // => app.use('/assets', express.static('assets'))
  app.use(path.resolve(STATS.publicPath), express.static(path.basename(STATS.publicPath)))
}

app.get('*', handleRequest)
app.listen(PORT, () => log.info(`server listening on port ${PORT}`))
