const React = require('react')
const { Provider } = require('react-redux')
const { RoutingContext } = require('react-router')
const { renderToString } = require('react-dom/server')
const findAndReplaceReducerFromComponents = require('./findAndReplaceReducerFromComponents')
const loadStylesFromComponents = require('./loadStylesFromComponents')
const {
  createPage,
  write,
} = require('./server-utils')
const resolveGraphQueries = require('./resolveGraphQueries')

function renderApp(store, props, token, res) {
  // register correct reducer for this route
  findAndReplaceReducerFromComponents(props.components, store.replaceReducer)

  // --------------------------------------------------------------------------
  // Hybrid Approach (components return (dispatched) promises in fetchData)
  // --------------------------------------------------------------------------
  const fetchDataPromises = props.components
    .filter(component => component && typeof component.fetchData === 'function')
    .map(component => component.fetchData({
      dispatch: store.dispatch,
      state: store.getState(),
    }))

  const graphQLPromise = resolveGraphQueries(props.components, store)

  Promise
    .all([...fetchDataPromises, graphQLPromise])
    .then(() => {
      const markup = renderToString(
        <Provider store={store}>
          <RoutingContext {...props}/>
        </Provider>
      )

      const styles = loadStylesFromComponents(props.components)
      const html = createPage(markup, store.getState(), styles)
      write(html, 'text/html', res)
    })
    .catch(error => {
      console.error(error) // eslint-disable-line no-console
      write(`<p>API server down.</p><pre>${JSON.stringify(error, null, 2)}</pre>`, 'text/html', res)
    })
}

module.exports = renderApp
