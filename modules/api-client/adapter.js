class BaseAdapter {/* TODO handle caching!?  */}
let Adapter
if (CLIENT) {
  // us something that uses fetch at localhost:30001/graphql/v1
  Adapter = class clientAdapter extends BaseAdapter {
    constructor({ endpoint }) {
      super()
      this.endpoint = endpoint
    }
    execute(query, variables) {
      return fetch(this.endpoint, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
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
