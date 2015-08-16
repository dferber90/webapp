import React from 'react'
import ReactDOMServer from 'react-dom/server'
import getRootRoute from 'common/routes/rootRoute'
import Router from 'react-router'
import Location from 'react-router/lib/Location'
import App from 'common/components/App'
import { getChunkFilePath, shrinkPage, generateHTML } from './util'
import StoresRegistry from 'common/util/StoresRegistry'
import { routerStateReducer } from 'redux-react-router'

export default function (path, query) {
  return new Promise((resolve, reject) => {
    const location = new Location(path, query)


    // get data: can be seen here in 'fetchSomeData'
    // http://rackt.github.io/react-router/tags/v1.0.0-beta3.html
    const storesRegistry = new StoresRegistry({
      router: routerStateReducer
    })
    const store = storesRegistry.store
    const userContext = {
      storesRegistry: storesRegistry
    }
    const rootRoute = getRootRoute(store, userContext)

    Router.run(rootRoute, location, (error, initialState/*, transition*/) => {
      if (error) {
        console.log('error occured while trying to run router')
        return reject(error)
      }
      if (!initialState) {
        return reject(
          new Error(`initialState was falsy for ${location.pathname}`)
        )
      }

      // can get data needs from initial components using GraphQL
      // console.log(initialState.components)
      let appHtml
      try {
        appHtml = ReactDOMServer.renderToString(
          <App server={initialState}/>
        )
      } catch (e) {
        console.error(e)
        return reject(e)
      }

      const html = generateHTML({
        initialData: {
          reducers: Object.keys(storesRegistry.reducers),
          store: store.getState()
        },
        html: appHtml,
        entryChunkPath: getChunkFilePath(initialState.location.pathname)
      })

      return resolve(__DEV__ ? html : shrinkPage(html))
    })
  })
}
