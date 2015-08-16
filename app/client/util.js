/*
 * Transforms ['todos', 'counter']
 * into { todos: require(todosReducer), counter: require(counterReducer) }
 */
export function getReducers (reducerKeys) {
  const reducers = {}

  reducerKeys
    .filter(reducerKey => reducerKey !== 'router')
    .map(reducerKey => {
      reducers[reducerKey] = require('common/reducers/' + reducerKey)
    })

  return reducers
}
