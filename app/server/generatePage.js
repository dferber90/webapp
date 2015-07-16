import React from 'react'
import ReactDOMServer from 'react-dom/server'
import getRootRoute from '../common/routes/getRootRoute'
import Router from 'react-router'
import Location from 'react-router/lib/Location'
import App from '../common/container/App'
import { getEntryPointFile, shrinkPage, generateHTML } from './util'
import createStore from '../common/util/createStore'

export default function (path, query) {
  return new Promise((resolve, reject) => {
    const location = new Location(path, query)


    // get data: can be seen here in 'fetchSomeData'
    // http://rackt.github.io/react-router/tags/v1.0.0-beta3.html
    const store = createStore()
    const rootRoute = getRootRoute(store)
    // const resolvedRoutes = rootRoute.childRoutes
    Router.run([rootRoute], location, (error, initialState/*, transition*/) => {
      if (error) return reject(error)
      if (!initialState) return reject(new Error('initialState was falsy'))

      // can get data needs from initial components using GraphQL
      // console.log(initialState.components)

      const appHtml = ReactDOMServer.renderToString(
        <App server={initialState} store={store}/>
      )

      const html = generateHTML({
        initialData: store.getState(),
        html: appHtml,
        entryPoint: getEntryPointFile(initialState.location.pathname)
      })

      resolve(__DEV__ ? html : shrinkPage(html))
    })
  })
}
