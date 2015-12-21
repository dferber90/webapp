const resolveGraphQueries = require('./resolveGraphQueries')

function satisfyDataRequirements(components, store) {
  const fetchDataPromises = components
    .filter(component => component && typeof component.fetchData === 'function')
    .map(component => component.fetchData({
      dispatch: store.dispatch,
      state: store.getState(),
    }))

  const graphQLPromise = resolveGraphQueries(components, store)

  return [...fetchDataPromises, graphQLPromise]
}

module.exports = satisfyDataRequirements
