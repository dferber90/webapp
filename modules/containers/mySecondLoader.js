/* eslint no-var: [0], vars-on-top: [0], func-names: [0] */
var loaderUtils = require('loader-utils')

module.exports = function() {}
module.exports.pitch = function(remainingRequest) {
  if (this.cacheable) this.cacheable()

  return [
    '// universal-css-modules-loader: Loads css',
    '',
    'var content = require(' + loaderUtils.stringifyRequest(this, '!!' + remainingRequest) + ');',
    'if (typeof content === "string") content = [[module.id, content, ""]];',
    '',
    'module.exports = content.locals || {}',
    'module.exports.raw = content',
  ].join('\n')
}
