const authReducer = require('./auth')
const pendingReducer = require('./pending')
const { routeReducer } = require('redux-simple-router')
const { reducer: formReducer } = require('redux-form')
const graphqlReducer = require('./graphql')
const reduceReducers = require('../utils/reduceReducers')

// TODO actually use this
function loginFormReducer(state, action) {
  switch (action.type) {
    case 'AUTH_LOGIN_FAIL':
      return { ...state, password: {} }
    default:
      return state
  }
}

const combinedReducers = (state, action) => {
  return {
    ...state,
    routing: routeReducer(state.routing, action),
    auth: authReducer(state.auth, action),
    pending: pendingReducer(state.pending, action),
    form: formReducer.plugin({
      login: loginFormReducer,
    })(state.form, action),
  }
}

const defaultReducer = reduceReducers(combinedReducers, graphqlReducer)
module.exports = defaultReducer
