module.exports = function (userContext) {
  return {
    path: '/',

    getComponents (cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/Landing'))
      }, 'landing-async')
    },
    userContext: userContext
  }
}

