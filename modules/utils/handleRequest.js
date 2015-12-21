const {
  writeError,
  writeNotFound,
  redirect,
} = require('./server-utils')
const getRootRoute = require('../routes/RootRoute')
const getCreateAppStore = require('./getCreateAppStore')
const { match } = require('react-router')
const { setRedirectLocation } = require('../action-creators/auth')
const { tokenToAuth } = require('./token')
const { syncReduxAndRouter } = require('redux-simple-router')
const { createMemoryHistory } = require('history')
const { serialize } = require('cookie')
const renderApp = require('./renderApp')
const PrettyError = require('pretty-error')
const pretty = new PrettyError()

function handleRequest(req, res) {
  const token = req.cookies.token
  const auth = tokenToAuth(token)
  const rootValue = { auth, rdb: req.rdb }
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
}

module.exports = handleRequest
