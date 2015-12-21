const Frontpage = require('../containers/Frontpage.js')
const App = require('../containers/App.js')
const Layout = require('../components/Layout.js')

module.exports = store => ({
  path: '/',
  component: App,
  childRoutes: [
    {
      component: Layout,
      childRoutes: [
        require('./AboutRoute')(store),
        require('./DashboardRoute')(store),
        require('./AccountsRoute')(store),
        {
          indexRoute: {
            component: Frontpage,
          },
        },
      ],
    },
  ],
})
