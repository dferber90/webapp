module.exports = () => ({
  path: 'account',
  childRoutes: [
    {
      path: 'login',
      getComponent(location, cb) {
        require.ensure(
          [],
          (require) => cb(null, require('../containers/Login.js'))
        )
      },
    },
  ],
})
