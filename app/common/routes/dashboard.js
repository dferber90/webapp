module.exports = function (userContext) {
  return {
    path: 'dashboard',

    getComponents (cb) {
      require.ensure([], (require) => {
        cb(null, require('common/components/dashboard/Dashboard'))
      }, 'dashboard-async')
    },
    userContext: userContext
  }
}
