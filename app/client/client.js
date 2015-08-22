/**
 * Entry point for webpack when generating the client bundles.
 *
 * It
 *   - rehydrates the state sent from the server.
 *   - renders the app
 *   - sets up redux (registers initial reducers)
 *   - when in development
 *     - adds devtools
 *     - exposes variables to the browser
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router'
import { history } from 'react-router/lib/BrowserHistory'
import getRootRoute from 'common/routes/rootRoute'
import AsyncProps from 'react-router/lib/experimental/AsyncProps'
import App from 'common/components/App'
import { INITIAL_DATA } from 'common/constants/initial'
import { APP_ID } from 'common/constants/ids'
import ReducerRegistry from 'common/util/ReducerRegistry'
import { routerStateReducer } from 'redux-react-router'

document.addEventListener('DOMContentLoaded', function () {
  if (typeof history.setup === 'function') {
    history.setup()
  }

  // rehydrate state sent from server
  const initialData = window[INITIAL_DATA]

  // initialize redux store with state from server
  const reducerRegistry = new ReducerRegistry({ router: routerStateReducer })
  const { store } = reducerRegistry
  const rootRoute = getRootRoute(store, { reducerRegistry })

  const clientOptions = {
    history,
    children: rootRoute,
    createElement: AsyncProps.createElement
  }
  Router.run(rootRoute, history.location, (error) => {
    if (error) return console.error(error)

    // have to render once for reducers to be picked up and registered,
    // so the app is rendered to an element not attached to the DOM
    ReactDOM.render(
      <App client={clientOptions}/>,
      document.createElement('div')
    )

    // rehydrate state sent from server
    reducerRegistry.rehydrate(initialData)

    // now that all reducers are registered, the app can render for real
    // and will have the same DOM as on the server
    // TODO there has to be a better way!
    ReactDOM.render(
      <App client={clientOptions}/>,
      document.getElementById(APP_ID)
    )
  })

  // expose variables to browser
  if (__DEV__) {
    window.playground = { history, store, React, ReactDOM, Router }
  }
})
