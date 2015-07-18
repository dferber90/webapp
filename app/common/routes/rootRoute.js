import { reduxRouteComponent } from 'redux-react-router'

export default function getRootRoute (initialState) {
  return {
    component: reduxRouteComponent(initialState),
    childRoutes: [{
      childRoutes: [
        require('./landing/index'),
        require('./dashboard/index')

        // require('./routes/Course'),
        // require('./routes/Grades'),
        // require('./routes/Messages'),
        // require('./routes/Profile')
      ]
    }]
  }
}
