const startAsyncAction = () => ({ type: 'PENDING', payload: 1 })
const handleResolveOrReject = dispatch => promiseResult => { dispatch({ type: 'PENDING', payload: -1 }); return promiseResult }
const pendingMiddleware = ({ dispatch }) => next => action => {
  // handle promises passed in
  if (typeof action.then === 'function') {
    dispatch(startAsyncAction())
    action
      .then(handleResolveOrReject(dispatch), handleResolveOrReject(dispatch))
      .catch(handleResolveOrReject(dispatch))
  }

  // handle fsa where the content is a promise
  if (action.payload && typeof action.payload.then === 'function') {
    dispatch(startAsyncAction())
    action.payload
      .then(handleResolveOrReject(dispatch), handleResolveOrReject(dispatch))
      .catch(handleResolveOrReject(dispatch))
  }
  return next(action)
}

module.exports = pendingMiddleware
