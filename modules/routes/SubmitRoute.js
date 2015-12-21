const requireAuthentication = require('./utils/requireAuthentication')

module.exports = store => ({
  path: 'submit',
  getComponent(location, cb) {
    require.ensure(
      [],
      (require) => cb(null, require('../containers/Submit.js'))
    )
  },
  onEnter: requireAuthentication(store),
})
