import { compose, createStore } from 'redux'

// TODO add async middleware (aka promiseMiddleware via applyMiddleware())
// https://github.com/gaearon/redux/blob/improve-docs/docs/middleware.md
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

export default finalCreateStore
