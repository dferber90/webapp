const { isFSA } = require('flux-standard-action')

const fsaMiddleware = () => next => action => {
  // the regex rejects non-FSA compliant internal actions (from redux-simple-router)
  if (!isFSA(action) && !/^@@/.test(action.type)) {
    console.warn('action is not FSA compliant', action) // eslint-disable-line no-console
  }
  return next(action)
}

module.exports = fsaMiddleware
