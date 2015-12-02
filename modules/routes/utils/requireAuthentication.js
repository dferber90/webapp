const { setRedirectLocation } = require('../../action-creators/auth')

const requireAuthentication = store => (nextState, replaceState) => {
  if (!store.getState().auth.isAuthenticated) {
    replaceState(null, '/account/login')
    store.dispatch(setRedirectLocation(nextState.location))
  }
}

module.exports = requireAuthentication
