/* eslint-disable no-console */

// from https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/server.js
module.exports = (error, req, res) => {
  if (error.code !== 'ECONNRESET') console.error('proxy error', error)
  if (!res.headersSent) res.writeHead(500, {'content-type': 'application/json'})

  console.log('Could not connect to proxy, please try again...')
  const json = { error: 'proxy_error', reason: error.message }
  res.end(JSON.stringify(json))
}
