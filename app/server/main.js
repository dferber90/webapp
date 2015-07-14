import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import rootRoute from '../common/routes/rootRoute'
import Router from 'react-router'
//import Location from 'react-router/lib/Location'
const Location = require('react-router/lib/Location')

/*
const getEntryPointFromPath = function (pathname) {
  if (/^\/dashboard[\/.*]$/.test(pathname)) {
    return 'dashboard'
  } else {
    return 'landing'
  }
}
*/

const app = express()
app.use(express.static('public'))

app.get('*', (req, res) => {
  const location = new Location(req.path, req.query)

  // const resolvedRoutes = rootRoute.childRoutes
  Router.run([rootRoute], location, (error, initialState/*, transitn*/) => {
    if (error) {
      console.error(error)
      return
    }
    if (!initialState) {
      console.log('skipping rendering because initalState was falsy')
      return
    }


    // TODO get data using redux
    // can be seen here in 'fetchSomeData'
    // http://rackt.github.io/react-router/tags/v1.0.0-beta3.html
    const initialData = { count: 7 }
    const html = ReactDOMServer.renderToString(<Router {...initialState}/>)
    // const entryPoint = getEntryPointFromPath(location.pathname)

    res.end(`
      <html>
        <head>
          <title>testing</title>
          <script>__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>
          <script src="/assets/commonsChunk.js"></script>
          <script src="/assets/app.entry.js"></script>
        </head>
        <body>
          <h2>hello</h2>
          <div
            id="react-app"
            style="border: 1px solid #ccc; margin: 10px; padding: 10px"
          >${html}</div>
          <textarea style="width: 100%; height: 50%">${html}</textarea>
        </body>
      </html>
    `)
  })
})

app.listen(3000)
if (__DEV__) console.log('server listening')
