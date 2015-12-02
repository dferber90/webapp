/* eslint
  no-var: [0]
  func-names: [0]
*/

// loads css-modules on server. loads names of exported css classes,
// without anything else. Can not generate correct hashes currently.
// Should probably be integrated into css-loader itself
// Dominik Ferber.

var processCss = require('css-loader/lib/processCss')
var loaderUtils = require('loader-utils')
var getLocalIdent = require('css-loader/lib/getLocalIdent')

module.exports = function(content, map) {
  // this.cacheable && this.cacheable(false);

  var callback = this.async()
  var query = loaderUtils.parseQuery(this.query)
  var moduleMode = query.modules || query.module

  // identifier to base64 (for css-modules class names)
  var localIdentName = query.localIdentName || '[hash:base64]'
  var localIdentRegExp = query.localIdentRegExp
  var context = query.context


  var options = {
    mode: moduleMode ? 'local' : 'global',
    from: loaderUtils.getRemainingRequest(this),
    to: loaderUtils.getCurrentRequest(this),
    query: query,
    minimize: this.minimize,
    loaderContext: this,
  }
  processCss(content, map, options, function(err, result) {
    var classNames = {}
    if (err) return callback(err)

    Object.keys(result.exports).map(function(key) {
      var item = result.exports[key]
      var replacedClasses = item.replace(result.importItemRegExpG, function(loaderImport) {
        var match = result.importItemRegExp.exec(loaderImport)
        var idx = +match[1]

        return getLocalIdent(
          options.loaderContext,
          localIdentName,
          result.importItems[idx].export,
          {
            regExp: localIdentRegExp,
            hashPrefix: query.hashPrefix || '',
            context: context,
          }
        )
      })
      classNames[key] = replacedClasses
    })

    callback(null, 'exports = module.exports = ' + JSON.stringify(classNames, undefined, '\t') + ';')
  })
}
