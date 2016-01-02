const Adapter = require('../api-client/adapter')

// ----------------------------------------------------------------------------
// GraphQL middleware
// ----------------------------------------------------------------------------
// could also have middleware for fetch(), i.e. when talking to GitHub API!
// same principles apply: dispatch on start, make request, dispatch on end
const createGraphQLMiddleware = adapterConfig => () => next => action => {
  const adapter = new Adapter(adapterConfig)

  switch (action.type) {
    case 'GRAPHQL': {
      const { onSuccess, onError } = action.meta || {}
      if (DEVELOPMENT) {
        if (!onSuccess) {
          throw new Error('graphql middleware tried to handle action without meta.onSuccess')
        }
        if (!onError) {
          throw new Error('graphql middleware tried to handle action without meta.onError')
        }
      }
      adapter
        .execute(action.payload.query, action.payload.variables)
        .then(onSuccess)
        .catch(onError)
      return next(action)
    }
    default:
      return next(action)
  }
}


module.exports = createGraphQLMiddleware
