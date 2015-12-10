const path = require('path')
const React = require('react')
const PrettyError = require('pretty-error')
const { renderToString } = require('react-dom/server')
const { match, RoutingContext } = require('react-router')
const express = require('express')
const compress = require('compression')
const { Provider } = require('react-redux')
const cookieParser = require('cookie-parser')
const {
  createPage,
  write,
  writeError,
  writeNotFound,
  redirect,
} = require('./utils/server-utils')
const getRootRoute = require('./routes/RootRoute')
const getCreateAppStore = require('./utils/getCreateAppStore')
const log = require('./log/server.js')
const pretty = new PrettyError()
const { loginSuccess, setRedirectLocation } = require('./action-creators/auth')
const { tokenToAuth } = require('./utils/token')
const findAndReplaceReducerFromComponents = require('./utils/findAndReplaceReducerFromComponents')
const loadStylesFromComponents = require('./utils/loadStylesFromComponents')
const { syncReduxAndRouter } = require('redux-simple-router')
const { createMemoryHistory } = require('history')
const { serialize } = require('cookie')
require('static!./images/favicon.ico?output=../public/favicon.ico')

const PORT = process.env.PORT || 3000

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function renderApp(store, auth, props, token, res) {
  // log user in
  if (auth.isAuthenticated) {
    store.dispatch(loginSuccess(token))
  }

  // register correct reducer for this route
  findAndReplaceReducerFromComponents(props.components, store.replaceReducer)

  // --------------------------------------------------------------------------
  // Hybrid Approach (components return (dispatched) promises in fetchData)
  // --------------------------------------------------------------------------
  const dataRequirements = props.components
    .filter(component => component && component.fetchData)
    .map(component => component.fetchData({
      dispatch: store.dispatch,
      getState: store.getState,
    }))

  Promise.all(dataRequirements)
  .then(() => {
    const markup = renderToString(
      <Provider store={store}>
        <RoutingContext {...props}/>
      </Provider>
    )

    const styles = loadStylesFromComponents(props.components)
    const html = createPage(markup, store.getState(), styles)
    write(html, 'text/html', res)
  })
  .catch(error => {
    console.log(error) // eslint-disable-line no-console
    write(`<p>API server down.</p><pre>${JSON.stringify(error, null, 2)}</pre>`, 'text/html', res)
  })
}

const app = express()
app.use(compress()) // should be first middleware

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

if (DEVELOPMENT) {
  const httpProxy = require('http-proxy')
  const proxy = httpProxy.createProxyServer()

  // add error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', require('./utils/handleProxyError.js'))

  // eg /assets/*
  app.all(`${STATS.publicPath}*`, (req, res) => proxy.web(req, res, { target: 'http://localhost:8080' }))
} else {
  // STATS.publicPath -> /assets/
  // /assets/ needs to be transformed for app.use as shown below
  // app.use('/assets', express.static('assets'))
  // path.resolve and path.basename do exactly this
  app.use(path.resolve(STATS.publicPath), express.static(path.basename(STATS.publicPath)))
}


app.get('*', (req, res) => {
  const token = req.cookies.token
  const auth = tokenToAuth(token)
  const rootValue = { auth }
  const createAppStore = getCreateAppStore(rootValue)
  const store = createAppStore({ counter: 3 })
  const history = createMemoryHistory()
  syncReduxAndRouter(history, store)
  const routes = getRootRoute(store)
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      console.error(error, pretty.render(error)) // eslint-disable-line no-console
      writeError('ERROR!', res)
    } else if (redirectLocation) {
      if (redirectLocation.pathname === '/account/login') {
        res.header('Set-Cookie', serialize('redirectLocation', req.url, {
          path: '/',
          httpOnly: true,
        }))
      }
      redirect(redirectLocation.pathname, res)
    } else if (renderProps) {
      if (req.cookies.redirectLocation) {
        res.header('Set-Cookie', serialize('redirectLocation', false, {
          path: '/',
          maxAge: -1,
          httpOnly: true,
        }))
        store.dispatch(setRedirectLocation(req.cookies.redirectLocation))
      }
      renderApp(store, auth, renderProps, token, res)
    } else {
      writeNotFound(res)
    }
  })
})

app.listen(PORT, () => log.info(`server listening on port ${PORT}`)) // eslint-disable-line no-console
