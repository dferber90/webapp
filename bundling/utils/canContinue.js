var log = require('npmlog')
var PrettyError = require('pretty-error')
var pretty = new PrettyError()

module.exports = function canContinue(where, err, stats) {
  if (err) {
    log.info('webpack', where + ' compiler had error:', err)
    return false
  }
  var jsonStats = stats.toJson()
  if (jsonStats.errors.length > 0) {
    log.error('webpack', where + ' compiler had errors:')
    jsonStats.errors.map(function (error) { console.log(pretty.render(error)) })
    return false
  }
  if (jsonStats.warnings.length > 0) {
    log.warn('webpack', where + ' compiler had warnings:', jsonStats.warnings)
    return false
  }
  return true
}
