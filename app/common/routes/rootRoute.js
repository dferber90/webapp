import { reduxRouteComponent } from 'redux-react-router'

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
