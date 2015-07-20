module.exports = function (userContext) {
  return {
    path: 'dashboard',

    getComponents (cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/Dashboard'))
      }, 'dashboard-async')
    },
    userContext: userContext
  }
}
