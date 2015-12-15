const { compose, createStore, applyMiddleware } = require('redux')
const thunk = require('redux-thunk')
const promise = require('redux-promise')
const defaultReducer = require('../reducers/default')
const createGraphQLMiddleware = require('../middleware/graphql')
// const pendingMiddleware = require('../middleware/pending')

module.exports = rootValue => initialState => {
  // --------------------------------------------------------------------------
  // middleware
  // --------------------------------------------------------------------------
  const middleware = [thunk, /* pendingMiddleware, */promise]


  const graphqlMiddleware = createGraphQLMiddleware({
    endpoint: 'http://localhost:3001/graphql/v1',
    rootValue,
  })
  middleware.unshift(graphqlMiddleware)

  if (DEVELOPMENT) {
    const fsaMiddleware = require('../middleware/fsa')
    middleware.push(fsaMiddleware)
  }

  if (CLIENT) {
    const createLogger = require('redux-logger')
    middleware.push(createLogger())
  }

  if (SERVER) {
    const createNodeLogger = require('redux-node-logger')
    middleware.push(createNodeLogger())
  }

  // --------------------------------------------------------------------------
  // store enhancers
  // --------------------------------------------------------------------------
  const storeEnhancers = [applyMiddleware(...middleware)]
  if (CLIENT) {
    if (DEVELOPMENT) {
      if (window.devToolsExtension) {
        storeEnhancers.push(window.devToolsExtension())
      }
    }
  }

  // --------------------------------------------------------------------------
  // compose
  // --------------------------------------------------------------------------
  const finalCreateStore = compose(...storeEnhancers)(createStore)
  return finalCreateStore(defaultReducer, initialState)
}
