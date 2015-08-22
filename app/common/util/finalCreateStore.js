import { compose, createStore, applyMiddleware } from 'redux'

// TODO add async middleware (aka promiseMiddleware via applyMiddleware())
// https://github.com/gaearon/redux/blob/improve-docs/docs/middleware.md
let finalCreateStore
if (__DEV__) {

  let composedCreateStore
  if (__DEVTOOLS__) {
    const { devTools } = require('redux-devtools')
    composedCreateStore = compose(
      devTools(),
      createStore
    )
  } else {
    composedCreateStore = createStore
  }


  if (__CLIENT__) {
    const createLogger = require('redux-logger')
    const logger = createLogger()
    const createStoreWithMiddleWare = applyMiddleware(
      logger
    )(composedCreateStore)
    finalCreateStore = createStoreWithMiddleWare
  } else {
    finalCreateStore = composedCreateStore
  }
} else {
  finalCreateStore = createStore
}

export default finalCreateStore
