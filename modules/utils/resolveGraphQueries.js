const { parse, Source, print, visit } = require('graphql/language')

// TODO refactor this into smaller functions
function resolveGraphQueries(components, store) {
  const state = store.getState()

  let aliasCount = 0
  const uniqueAliasToQueryAliasMap = new Map()
  const allGraphQLQueries = components
    .filter(component => component && component.graphQuery)
    .map(component => {
      const query = component.graphQuery(state)
      if (!query) {
        return false
      }
      return { componentName: component.displayName, query }
    })
    .filter(dataDescription => typeof dataDescription === 'object')
    .reduce((prev, cur) => {
      try {
        const ast = parse(new Source(cur.query))
        const renamedAST = visit(ast, {
          SelectionSet(node, key, parent) {
            if (parent.kind !== 'OperationDefinition') {
              return node
            }

            return {
              ...node,
              selections: node.selections.map(selection => {
                const newAlias = 'uniqueAlias' + (aliasCount++)
                if (selection.alias) {
                  uniqueAliasToQueryAliasMap.set(newAlias, selection.alias.value)
                  uniqueAliasToQueryAliasMap.set(selection.alias.value, selection.name.value)
                } else {
                  uniqueAliasToQueryAliasMap.set(newAlias, selection.name.value)
                }
                return {
                  ...selection,
                  alias: {
                    kind: 'Name',
                    value: newAlias,
                  },
                }
              }),
            }
          },
        })

        return prev + '\n' + print(renamedAST)
      } catch (e) {
        if (DEVELOPMENT) {
          console.log(e) // eslint-disable-line no-console
          console.log('maybe invalid graphQuery in ' + cur.componentName) // eslint-disable-line no-console
        }
      }
    }, '')

  const graphQLPromise = new Promise((resolve, reject) => {
    if (allGraphQLQueries === '') return resolve({})

    store.dispatch({
      type: 'GRAPHQL',
      payload: {
        query: allGraphQLQueries,
        variables: {},
      },
      meta: {
        onSuccess: resolve,
        onError: reject,
      },
    })
  })
  .then(result => {
    if (result.data) {
      Object.keys(result.data).map(key => {
        const value = result.data[key]
        const queryEdge = uniqueAliasToQueryAliasMap.get(key)
        let edge = queryEdge
        if (queryEdge) {
          const originalEdge = uniqueAliasToQueryAliasMap.get(queryEdge)
          if (originalEdge) {
            edge = originalEdge
          }
        }

        // TODO remove aliases of nested fields
        store.dispatch({
          type: 'GRAPHQL_DATA_ARRIVED',
          payload: {
            edge,
            data: value,
          },
        })
      })
    }
    return result
  })

  return graphQLPromise
}

module.exports = resolveGraphQueries
