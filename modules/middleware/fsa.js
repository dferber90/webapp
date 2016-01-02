const { isFSA } = require('flux-standard-action')

const fsaMiddleware = () => next => action => {
  if (!isFSA(action) && !/^redux-form\//i.test(action.type)) {
    console.warn('action is not FSA compliant', action) // eslint-disable-line no-console
  }
  return next(action)
}

module.exports = fsaMiddleware
