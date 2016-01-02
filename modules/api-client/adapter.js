class BaseAdapter {/* TODO handle caching!?  */}
let Adapter
if (CLIENT) {
  // us something that uses fetch at localhost:3001/graphql/v1
  Adapter = class clientAdapter extends BaseAdapter {
    constructor({ endpoint }) {
      super()
      this.endpoint = endpoint
    }
    execute(query, variables) {
      // TODO use token from store instead!?
      // otherwise it could lead to unexpected results (having token, but not being logged in etc)
      const token = localStorage.getItem('token')
      const authorizationHeader = token ? { 'Authorization': 'Bearer ' + localStorage.getItem('token') } : {}
      return fetch(this.endpoint, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          ...authorizationHeader,
        },
        body: JSON.stringify({
          query,
          ...(variables ? { variables } : {}),
        }),
      })
      .then(res => res.json())
    }
  }
}
if (SERVER) {
  const graphQLSchema = require('../graphql/schema')
  const { graphql } = require('graphql')
  // use something that uses graphql directly
  Adapter = class serverAdapter extends BaseAdapter {
    constructor({ rootValue }) {
      super()
      this.rootValue = rootValue
    }
    execute(query, variables = {}) {
      return graphql(graphQLSchema, query, this.rootValue, variables)
    }
  }
}

module.exports = Adapter
