const zlib = require('zlib')

// const API_URL = 'http://localhost:3001/api/v1'
// const fetch = require('isomorphic-fetch')
// const { checkHttpStatus, parseJSON } = require('./fetch-utils.js')

module.exports = {
  writeError(msg, res) {
    res.writeHead(500, { 'Content-Type': 'text/html' })
    res.write('ERROR!')
    res.end()
  },

  redirect(location, res) {
    res.writeHead(303, { 'Location': location })
    res.end()
  },

  writeNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.write('Not Found')
    res.end()
  },

  write(string, type, res) {
    zlib.gzip(string, (err, result) => {
      res.writeHead(200, {
        'Content-Length': result.length,
        'Content-Type': type,
        'Content-Encoding': 'gzip',
      })
      res.write(result)
      res.end()
    })
  },

  createPage(html, state, styles) {
    return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>My Universal App!</title>
      <style type="text/css" id="fast-css">${styles}</style>
        <script>APP_STATE=${JSON.stringify(state)}</script>
      </head>
      <body>
        <div id="app">${html}</div>
        <script src="/assets/vendor.js"></script>
        <script src="/assets/react.js"></script>
        <script src="/assets/app.js"></script>
        <script src="http://localhost:8080/webpack-dev-server.js"></script>
      </body>
    </html>
    `
  },

  // unused, decoding directly on server to speed things up
  /*
  verifyToken(token) {
    return (
      fetch(`${API_URL}/accounts/login/token`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => response.status === 'success' && response.payload.tokenValid)
    )
  },
  */
}
