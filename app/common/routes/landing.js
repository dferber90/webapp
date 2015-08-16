module.exports = function (userContext) {
  return {
    path: '/',

    getComponents (cb) {
      require.ensure([], (require) => {
        cb(null, require('common/components/landing/Landing'))
      }, 'landing-async')
    },
    userContext: userContext
  }
}

