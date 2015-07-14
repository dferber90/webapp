module.exports = {
  path: '/',

  getComponents (cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Landing'))
    }, 'landing-async')
  }
}

