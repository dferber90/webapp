var fs = require('fs')

module.exports = function () {
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
