import React from 'react'
import ReactDOMServer from 'react-dom/server'
import getRootRoute from 'common/routes/rootRoute'
import Router from 'react-router'
import Location from 'react-router/lib/Location'
import App from 'common/components/App'
import * as util from 'server/util/generatePageHelpers'
import ReducerRegistry from 'common/util/ReducerRegistry'
import { routerStateReducer } from 'redux-react-router'
import _ from 'lodash'

export default function (path, query) {
  return new Promise((resolve, reject) => {
    const location = new Location(path, query)


    // get data: can be seen here in 'fetchSomeData'
    // http://rackt.github.io/react-router/tags/v1.0.0-beta3.html
    const reducerRegistry = new ReducerRegistry({
      router: routerStateReducer
    })
    const store = reducerRegistry.store
    const session = { reducerRegistry }
    const rootRoute = getRootRoute(store, session)

    Router.run(rootRoute, location, (error, initialRouterState) => {
      if (error) {
        console.log('error occured while trying to run router')
        return reject(error)
      }
      if (!initialRouterState) {
        return reject(
          new Error(`initialRouterState was falsy for ${location.pathname}`)
        )
      }

      store.dispatch({
        type: 'ADD_TODO',
        payload: { text: 'dynamic todo' }
      })

      // can get data needs from initial components using GraphQL
      // console.log(initialRouterState.components)
      let appHtml
      try {
        appHtml = ReactDOMServer.renderToString(
          <App server={initialRouterState}/>
        )
      } catch (e) {
        console.error(e)
        return reject(e)
      }

      const { pathname } = initialRouterState.location
      const html = util.generateHTML({
        initialData: _.omit(store.getState(), 'router'),
        html: appHtml,
        entryChunksPaths: util.getChunkFilePaths(pathname)
      })

      return resolve(__DEV__ ? html : util.shrinkPage(html))
    })
  })
}
