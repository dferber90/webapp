import { reduxRouteComponent } from 'redux-react-router'
import sessionComponentFactory from 'common/util/sessionComponentFactory'

/**
 * Gets the root route.
 *
 * Passes additional information for this client down to routes using
 * SessionComponent.
 *
 * @param  {Redux Store} store
 * @param  {Object} session
 * @return {Object} React-Router route definition
 */
export default function getRootRoute (store, session = {}) {

  const SessionComponent = sessionComponentFactory(session)

  return {
    component: reduxRouteComponent(store),

    childRoutes: [
      {
        path: '/',
        getComponents (cb) {
          require.ensure([], (require) => {
            const Landing = require('common/components/landing/Landing')
            cb(null, SessionComponent(Landing))
          }, 'landing.components')
        }
      },
      {
        path: 'dashboard',
        getComponents (cb) {
          require.ensure([], (require) => {
            const Dashboard = require('common/components/dashboard/Dashboard')
            cb(null, SessionComponent(Dashboard))
          }, 'dashboard.components')
        }
      },
      {
        getChildRoutes (state, cb) {
          require.ensure([], (require) => {
            cb(null, [
              require('common/routes/dashboardSub.js')(SessionComponent),
              // ... possibly more gradually matched (dynamically loaded)
              // child routes
            ])
          }, 'dashboard-sub.routes')
        }
      }
    ]
  }
}
