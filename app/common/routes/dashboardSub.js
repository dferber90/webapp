module.exports = function (SessionComponent) {
  return {
    path: 'dashboard/sub',
    getComponents (cb) {
      require.ensure([], (require) => {
        const Sub = require('common/components/dashboard/Sub')
        cb(null, SessionComponent(Sub))
      }, 'dashboard-sub.components')
    }
  }
}
