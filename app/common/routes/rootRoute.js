import React, { Component } from 'react'
import { reduxRouteComponent } from 'redux-react-router'

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

  /*
   * Higher-order Component that adds session as prop
   *
   * This HoC is dynamically created for each user's session
   */
  const SessionComponent = ComposedComponent => class extends Component {
    render () {
      return <ComposedComponent {...this.props} session={session}/>
    }
  }

  return {
    component: reduxRouteComponent(store),
    childRoutes: [
      {
        path: '/',
        getComponents (cb) {
          require.ensure([], (require) => {
            const Landing = require('common/components/landing/Landing')
            cb(null, SessionComponent(Landing))
          }, 'landing-async')
        }
      },
      {
        path: 'dashboard',
        getComponents (cb) {
          require.ensure([], (require) => {
            const Dashboard = require('common/components/dashboard/Dashboard')
            cb(null, SessionComponent(Dashboard))
          }, 'dashboard-async')
        }
      }
    ]
  }
}
