/*
 * Transforms ['todos', 'counter']
 * into { todos: require(todosReducer), counter: require(counterReducer) }
 */
export function getReducers (reducerKeys) {
  const reducers = {}

  // TODO currently reducers will be split into app.entry.js,
  // instead of their appropriate bundles
  reducerKeys
    .filter(reducerKey => reducerKey !== 'router')
    .map(reducerKey => {
      reducers[reducerKey] = require('common/reducers/' + reducerKey)
    })

  return reducers
}
