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
import { APP_ID, DEBUG_ID } from 'common/constants/ids'
import ReducerRegistry from 'common/util/ReducerRegistry'
import { routerStateReducer } from 'redux-react-router'
import { REHYDRATE } from 'common/actionTypes/app'

document.addEventListener('DOMContentLoaded', function () {
  if (typeof history.setup === 'function') {
    history.setup()
  }

  // rehydrate state sent from server
  const initialData = window[INITIAL_DATA]

  // initialize redux store with state from server
  const reducerRegistry = new ReducerRegistry({
    router: routerStateReducer
  })
  const store = reducerRegistry.store
  const rootRoute = getRootRoute(store, { reducerRegistry })

  const clientOptions = {
    history,
    children: rootRoute,
    createElement: AsyncProps.createElement
  }
  Router.run(rootRoute, history.location, (error) => {
    if (error) return console.error(error)

    // TODO make this part of ReducerRegistry ?
    // TODO use actionCreator ?
    // rehydrate store after all required recuders have loaded
    store.dispatch({
      type: REHYDRATE,
      payload: initialData
    })

    ReactDOM.render(
      <App client={clientOptions}/>,
      document.getElementById(APP_ID)
    )

    // render devtools in development
    if (__DEV__ && __DEVTOOLS__) {
      const {
        DevTools,
        DebugPanel,
        LogMonitor
      } = require('redux-devtools/lib/react')
      ReactDOM.render(
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor}/>
        </DebugPanel>,
        document.getElementById(DEBUG_ID)
      )
    }
  })

  // expose variables to browser
  if (__DEV__) {
    window.playground = { history, store, React, ReactDOM, Router }
  }
})
