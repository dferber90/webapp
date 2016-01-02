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
const satisfyDataRequirements = require('./utils/satisfyDataRequirements.js')

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
  // TODO listenBefore runs twice somehow.
  // this causes data to be fetched twice
  // this may also be the reason the back button has to be pressed twice
  // This has to do with redux-simple-router, because it causes the second listenBefore
  console.log('listening before')
  match({ routes: rootRoute, location }, (error, redirectLocation, renderProps) => {
    if (!renderProps) return []

    Promise.all(satisfyDataRequirements(renderProps.components, store))
      .then(() => callback())
      .catch(resolveError => {
        console.error(resolveError) // eslint-disable-line no-console
        callback()
        // TODO move client to 500 page or recover somehow
      })
  })
})

// calling `match` is simply for side effects of
// loading route/component code for the initial location
match({ routes: rootRoute, location }, () => {
  render(
    <Provider store={store}>
      <Router routes={rootRoute} history={history}/>
    </Provider>,
    document.getElementById('app')
  )

  // remove server-generated css
  document.getElementById('fast-css').remove()
})

// in case we had no cookie, but have the token in localStorage, we should try to
// log in immediately. Has to happen after rendering for the first time so the
// markup matches
// const token = localStorage.getItem('token')
// if (token) {
//   store.dispatch(loginSetToken(token))
// }

// in case we had cookie but no info in localStorage, set it in localStorage
//
// in both cases, delete the information if it is outdated
