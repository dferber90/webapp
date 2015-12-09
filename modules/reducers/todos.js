function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.payload])
    case 'SET_TODOS':
      return action.payload
    default:
      return state
  }
}

module.exports = todos
