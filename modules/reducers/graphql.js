const merge = require('deepmerge')
// const { normalize, Schema, arrayOf } = require('normalizr')
// const users = new Schema('users')


function mergeMeEdge(state, data) {
  return {
    ...state,
    users: merge(state.users || {}, { [data.id]: data }),
  }
}

function graphqlReducer(state = {}, action) {
  switch (action.type) {
    case 'GRAPHQL_DATA_ARRIVED': {
      switch (action.payload.edge) {
        case 'me': return mergeMeEdge(state, action.payload.data)
        default: return state
      }
    }
    default: return state
  }
  return state
}

module.exports = graphqlReducer
