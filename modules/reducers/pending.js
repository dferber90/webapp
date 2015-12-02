/*
 * Pending Reducer for async actions.
 * Keeps a count of all pending async actions.
 *
 * Every async action dispatches this meta when it starts loading
 *   { type: '..', payload: {..}, meta: { pending: 1 } }
 * And dispatches the following after it is done loading
 *   { type: '..', payload: {..}, meta: { pending: -1 } }
 *
 * This way the store always knows how many async requests are outstanding.
 * On the server, the app can render when the count reaches 0.
 */

function pendingReducer(state = 0, action) {
  if (action.meta && action.meta.pending) {
    return state + action.meta.pending
  }
  if (action.type === 'PENDING') {
    return state + action.payload
  }
  return state
}

module.exports = pendingReducer
