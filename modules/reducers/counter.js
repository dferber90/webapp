function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT_COUNTER':
      return state + 1
    default:
      return state
  }
}

module.exports = counter
