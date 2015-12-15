const React = require('react')
const { Provider } = require('react-redux')
const { RoutingContext } = require('react-router')
const { renderToString } = require('react-dom/server')
const { loginSuccess } = require('../action-creators/auth')
const findAndReplaceReducerFromComponents = require('./findAndReplaceReducerFromComponents')
const loadStylesFromComponents = require('./loadStylesFromComponents')
const {
  createPage,
  write,
} = require('./server-utils')

function renderApp(store, auth, props, token, res) {
  // log user in
  if (auth.isAuthenticated) {
    store.dispatch(loginSuccess(token))
  }

  // register correct reducer for this route
  findAndReplaceReducerFromComponents(props.components, store.replaceReducer)

  // --------------------------------------------------------------------------
  // Hybrid Approach (components return (dispatched) promises in fetchData)
  // --------------------------------------------------------------------------
  const dataRequirements = props.components
    .filter(component => component && component.fetchData)
    .map(component => component.fetchData({
      dispatch: store.dispatch,
      getState: store.getState,
    }))

  Promise.all(dataRequirements)
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
    console.log(error) // eslint-disable-line no-console
    write(`<p>API server down.</p><pre>${JSON.stringify(error, null, 2)}</pre>`, 'text/html', res)
  })
}

module.exports = renderApp
