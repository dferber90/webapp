const requireAuthentication = require('./utils/requireAuthentication')

module.exports = store => ({
  path: 'dashboard',
  onEnter: requireAuthentication(store),
  getComponent(location, cb) {
    require.ensure(
      [],
      (require) => {
        const DashboardComponent = require('../containers/Dashboard.js')
        cb(null, DashboardComponent)
      }
    )
  },
})
