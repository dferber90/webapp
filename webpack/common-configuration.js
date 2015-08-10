/* eslint
  no-var: [0]
*/

/**
 * Contains options shared by client and server configuration in
 * - webpack/webpack.config.js
 * - webpack/test.js
 */

var fs = require('fs')
var path = require('path')

var resolve = {
  alias: {
    public: path.join(__dirname, '..', 'public')
  },
  root: [
    path.join(__dirname, '..', 'app')
  ]
}

var getNodeModules = function () {
  var nodeModules = {}
  fs.readdirSync('node_modules')
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1
    })
    .forEach(function (mod) {
      nodeModules[mod] = 'commonjs ' + mod
    })
  return nodeModules
}

module.exports = {
  resolve: resolve,
  getNodeModules: getNodeModules
}
