import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import rootRoute from '../common/routes/rootRoute'
import Router from 'react-router'
import { minify } from 'html-minifier'
import Location from 'react-router/lib/Location'
import App from '../common/container/App'

const getEntryPointFromPath = function (pathname) {
  if (pathname === '/') {
    console.log('main file')
    return 'landing-async'
  } else if (/^\/dashboard[\/.*]$/.test(pathname)) {
    console.log('dashboard file')
    return 'dashboard-async'
  }
  return false
}
const getEntryPointFile = function (pathname) {
  const entryPoint = getEntryPointFromPath(pathname)
  if (!entryPoint) return ''

  return `<script src="/assets/${entryPoint}.chunk.js"></script>`
}

const shrinkPage = function (html) {
  // all options can be seen here
  // https://www.npmjs.com/package/html-minifier
  return minify(html, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true
  })
}

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
    const appHtml = ReactDOMServer.renderToString(
      <App server={initialState}/>
    )
    const entryPointFile = getEntryPointFile(location.pathname)


    const html = `
      <html>
        <head>
          <title>testing</title>
          <script>__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>
          <script src="/assets/commonsChunk.js"></script>
          <script src="/assets/app.entry.js"></script>
          ${entryPointFile}
        </head>
        <body>
          <h2>hello</h2>
          <div
            id="react-app"
            style="border: 1px solid #ccc; margin: 10px; padding: 10px"
          >${appHtml}</div>
          <textarea style="width: 100%; height: 50%">${appHtml}</textarea>
        </body>
      </html>
    `

    // const page = __DEV__ ? html : shrinkPage(html)
    const page = shrinkPage(html)
    res.end(page)
  })
})

app.listen(3000)
if (__DEV__) console.log('server listening')
