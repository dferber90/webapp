import { createStore, combineReducers, compose } from 'redux'
// import createMiddleware from './clientMiddleware'
import { routerStateReducer } from 'redux-react-router'
import * as reducers from '../reducers/index'

// TODO
// import this file in another file as an object
// import * as StoresRegistry from './createStore'
// => all exported functions will be available on StoresRegistry
//
// StoresRegistry.getStore() -> get current store?
//  store is an object with properties
//    - .getState()
//    - .getReducer()
//    - .dispatch()
//    - .replaceReducer()
//    - .subscribe()
// StoresRegistry.registerReducer() -> add a new reducer
//
// The example by gaearon shows how to do it
// Let the app register a changeListener on the StoresRegistry
// Each time a new store is registered on the StoresRegistry,
// that listener is called. Now the app can rerender with the new stores.
// gaearon's example is using setState() for the rerendering

// This approach may be tricky as React Router exposes the current store
// to the app. Using a React component to rerender could not be possible.
// have to check on that.
// Maybe have a React component to Rerender called <Dispatcher/>
// in `getRootRoute.js` that has the Redux Router component as a child?
// It could then rerender on store changes?


// Current order when rendering:
//
//  App
//    Router
//      ReduxRouteComponent(store)
//        <Route>
//
//
// Current order when creating:
// store
//  rootRoute
//    reduxRouteComponent(store)
//      App

const reducer = combineReducers({
  router: routerStateReducer,
  ...reducers
})

export default function (data) {
  // const middleware = createMiddleware(client)
  let finalCreateStore
  if (__DEV__ && __DEVTOOLS__) {
    const { devTools } = require('redux-devtools')
    finalCreateStore = compose(
      devTools(),
      createStore
    )
  } else {
    finalCreateStore = createStore
  }
  return finalCreateStore(reducer, data)
}
