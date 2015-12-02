const React = require('react')
const { match, Router } = require('react-router')
const { render } = require('react-dom')
const { createHistory } = require('history')
const { Provider } = require('react-redux')
const getRootRoute = require('./routes/RootRoute')
const getCreateAppStore = require('./utils/getCreateAppStore')
const { syncReduxAndRouter } = require('redux-simple-router')
const createAppStore = getCreateAppStore({/* rootValues unused on client */})
const store = createAppStore(window.APP_STATE)

if (DEVELOPMENT) {
  window.store = store
}

// const myCreateElement = (Component, props) => {
//   if (Component.fetchData) {
//     Component.fetchData({
//       dispatch: store.dispatch,
//       getState: store.getState,
//       adapter: adapter,
//     })
//   }
//   return <Component {...props} />
// }

// load data before switching to new routes
const history = createHistory()
syncReduxAndRouter(history, store)

const rootRoute = getRootRoute(store)

history.listenBefore((location, callback) => {
  new Promise((resolve) => {
    match({ routes: rootRoute, location }, (error, redirectLocation, renderProps) => {
      resolve(renderProps)
    })
  })
  .then(renderProps => {
    if (!renderProps) return []

    return renderProps.components
      .filter(component => component && component.fetchData)
      .map(component => component.fetchData({
        dispatch: store.dispatch,
        getState: store.getState,
      }))
  })
  .then(callback)
  .catch(error => {
    console.log(error) // eslint-disable-line no-console
    // TODO move client to 500 page or recover somehow
  })
})

// calling `match` is simply for side effects of
// loading route/component code for the initial location
match({ routes: rootRoute, location }, (/* error, redirectLocation, renderProps */) => {
  render(
    <Provider store={store}>
      <Router routes={rootRoute} history={history}/>
    </Provider>,
    document.getElementById('app')
  )
})

// in case we had no cookie, but have the token in localStorage, we should try to
// log in immediately. Has to happen after rendering for the first time so the
// markup matches
// const token = localStorage.getItem('token')
// if (token) {
//   store.dispatch(loginSetToken(token))
// }

// re-enable when redux-devtools work with 0.14
// and add middleware to createAppStore
// if (DEVELOPMENT) {
//   const devToolsContainer = document.createElement('div')
//   devToolsContainer.id = 'redux-devtools-container'
//   document.body.appendChild(devToolsContainer)
//   render(
//     <LogMonitor store={store.devToolsStore} />,
//     document.getElementById('redux-devtools-container')
//   )
// }
