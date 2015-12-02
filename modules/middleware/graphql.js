const Adapter = require('../api-client/adapter')

// ----------------------------------------------------------------------------
// GraphQL middleware
// ----------------------------------------------------------------------------
// could also have middleware for fetch(), i.e. when talking to GitHub API!
// same principles apply: dispatch on start, make request, dispatch on end
const createGraphQLMiddleware = adapterConfig => () => next => action => {
  const adapter = new Adapter(adapterConfig)
  switch (action.type) {
  case 'GRAPHQL':
    // store.dispatch({
    //   type: 'GRAPHQL_LOAD_START',
    //   meta: { pending: 1 },
    // })
    return next(
      adapter
        .execute(action.payload.query, action.payload.variables)
        .then(data => action.meta.onSuccess(data))
        .catch(error => action.meta.onError(error))
      )
  default:
    return next(action)
  }
}


module.exports = createGraphQLMiddleware
