/* eslint
  no-var: [0]
*/

/**
 * Contains options shared by client and server configuration in
 * - webpack/webpack.config.js
 * - webpack/test.js
 */

var path = require('path')

var resolve = {
  alias: {
    public: path.join(__dirname, '..', 'public')
  },
  root: [
    path.join(__dirname, '..', 'app')
  ]
}

module.exports = {
  resolve: resolve
}
