// this is the entry point

import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router'
import { history } from 'react-router/lib/BrowserHistory'
import rootRoute from '../common/routes/rootRoute'
import AsyncProps from 'react-router/lib/experimental/AsyncProps'
import App from '../common/container/App'

// TODO use redux
// get data sent from server
// const initialData = global.__INITIAL_DATA__
document.addEventListener('DOMContentLoaded', function () {
  if (typeof history.setup === 'function') {
    history.setup()
  }

  Router.run([rootRoute], history.location, (error) => {
    if (error) {
      console.error(error)
      return
    }
    ReactDOM.render(
      <App
        client={{
          history,
          children: rootRoute,
          createElement: AsyncProps.createElement
        }}
      />,
      document.getElementById('react-app')
    )
  })
})
