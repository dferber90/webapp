const HelloWorld = require('../containers/HelloWorld.js')
const App = require('../containers/App.js')

// const exptected = new Collector(2, (collectedItems) => {
//   cb(null, collectedItems)
// })
// require.ensure([], (require) => { exptected.loaded(require('./AboutRoute.js')) }, 'about')
// require.ensure([], (require) => { exptected.loaded(require('./DashboardRoute.js')) }, 'dashboard')
// class Collector {
//   constructor(exptectedItemCount, cb) {
//     this.collectedItems = []
//     this.exptectedItemCount = exptectedItemCount
//     this.cb = cb
//   }
//   loaded (something) {
//     this.collectedItems.push(something)
//     if (this.collectedItems.length >= this.exptectedItemCount) {
//       this.cb(this.collectedItems)
//     }
//   }
// }

module.exports = store => ({
  path: '/',
  component: App,
  childRoutes: [
    require('./AboutRoute')(store),
    require('./DashboardRoute')(store),
    require('./AccountsRoute')(store),
  ],
  indexRoute: {
    component: HelloWorld,
  },
})
