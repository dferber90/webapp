import { reduxRouteComponent } from 'redux-react-router'

/**
 * Gets the root route.
 *
 * Passes additional information for this client down to routes.
 * @param  {Redux Store} store
 * @param  {Object} userContext
 * @return {Object} React-Router route definition
 */
export default function getRootRoute (store, userContext = {}) {
  return {
    component: reduxRouteComponent(store),
    childRoutes: [
      require('./landing/index')(userContext),
      require('./dashboard/index')(userContext)

      // require('./routes/Course'),
      // require('./routes/Grades'),
      // require('./routes/Messages'),
      // require('./routes/Profile')
    ]
  }
}
