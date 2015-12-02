// Takes multiple reducers and applies them one after another (left to right).
// Results from later reducers will overwrite earlier ones.
//
// pseudo code:
//   function reducerA(state, action) { return state }
//   function reducerB(state, action) { return state }
//   function reduceReducers(state, action) {
//     tmpState1 = reducerA(state, action)
//     tmpState2 = reducerB(tmpState2, action)
//     return tmpState2
//   }
module.exports = function reduceReducers(...reducers) {
  return (state, action) => reducers.reduce(
    (currentState, reducer) => reducer(currentState, action),
    state
  )
}
