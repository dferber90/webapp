import { reduxRouteComponent } from 'redux-react-router'

export default function getRootRoute (store) {
  return {
    component: reduxRouteComponent(store),
    childRoutes: [
      require('./landing/index'),
      require('./dashboard/index')

      // require('./routes/Course'),
      // require('./routes/Grades'),
      // require('./routes/Messages'),
      // require('./routes/Profile')
    ]
  }
}
