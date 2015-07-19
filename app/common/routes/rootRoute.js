import { reduxRouteComponent } from 'redux-react-router'

export default function getRootRoute (store) {
  console.log(store)
  return {
    component: reduxRouteComponent(store),
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
