import { createStore, applyMiddleware } from 'redux'

// TODO add async middleware (aka promiseMiddleware via applyMiddleware())
// https://github.com/gaearon/redux/blob/improve-docs/docs/middleware.md
let finalCreateStore
if (__DEV__) {
  if (__CLIENT__) {
    const createLogger = require('redux-logger')
    const logger = createLogger()
    const createStoreWithMiddleWare = applyMiddleware(
      logger
    )(createStore)
    finalCreateStore = createStoreWithMiddleWare
  } else {
    finalCreateStore = createStore
  }
} else {
  finalCreateStore = createStore
}

export default finalCreateStore
