module.exports = () => ({
  path: 'account',
  childRoutes: [
    {
      path: 'login',
      getComponent(location, cb) {
        require.ensure(
          [],
          (require) => cb(null, require('../containers/accounts/Login.js'))
        )
      },
    },
    {
      path: 'signup',
      getComponent(location, cb) {
        require.ensure(
          [],
          (require) => cb(null, require('../containers/accounts/Signup.js'))
        )
      },
    },
  ],
})
