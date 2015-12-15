const Frontpage = require('../containers/Frontpage.js')
const App = require('../containers/App.js')

module.exports = store => ({
  path: '/',
  component: App,
  childRoutes: [
    require('./AboutRoute')(store),
    require('./DashboardRoute')(store),
    require('./AccountsRoute')(store),
  ],
  indexRoute: {
    component: Frontpage,
  },
})
