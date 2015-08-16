import { minify } from 'html-minifier'
import { INITIAL_DATA } from 'common/constants/initial'
import { APP_ID, DEBUG_ID } from 'common/constants/ids'

/**
 * Gets the appropriate chunks based on the request path.
 *
 * It is okay to return an empty array. In this case webpack will request the
 * chunks when the app is loaded on the client.
 * Returning an empty array results in a slight increase in the time it takes
 * the app to become responsive on the client (at least 300ms), as the request
 * can only happen after the app logic is fully loaded and executing.
 * If an array of strings is returned, the file will be loaded instantly along
 * with the apps logic.
 *
 * Names for chunk files have to be specified in
 * `app/common/routes/`.
 * Webpack splits for components and child-routes of routes.
 *
 * @param  {String} pathname Request path.
 * @return {[String]}          Names of corresponding chunks.
 */
export function getChunksFromPath (pathname) {
  if (pathname === '/') {
    return ['landing.components']
  } else if (/^\/dashboard[\/]?$/.test(pathname)) {
    return ['dashboard.components']
  } else if (/^\/dashboard\/sub[\/]?$/.test(pathname)) {
    return [
      'dashboard-sub.routes',
      'dashboard-sub.components'
    ]
  }
  return []
}

export function getChunkFilePaths (pathname) {
  const initialChunks = getChunksFromPath(pathname)
  if (!initialChunks) return []

  return initialChunks.map(chunkName => `/assets/${chunkName}.chunk.js`)
}

export function shrinkPage (html) {
  // all options can be seen here
  // https://www.npmjs.com/package/html-minifier
  return minify(html, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    removeComments: true
  })
}

export function generateHTML ({ initialData, html, entryChunksPaths }) {
  const debugPanel = __DEV__ && __DEVTOOLS__ ?
    `<div id="${DEBUG_ID}"></div>` : ''

  // ensure localhost:8080 is opened
  const assertPort = __DEV__ ? `
  <script>
    console.assert(
      location.port === '8080',
      'Should use port 8080 in dev-mode. Visit http://localhost:8080/'
    )
  </script>
  ` : ''

  let initialChunks = generateInitialChunksHTML(entryChunksPaths)

  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>testing</title>
        ${assertPort}
        <script defer src="/assets/commonsChunk.js"></script>
        <script defer src="/assets/app.entry.js"></script>
        ${initialChunks}
      </head>
      <body>
        <div id="${APP_ID}">${html}</div>
        ${debugPanel}
        <script>${INITIAL_DATA} = ${JSON.stringify(initialData)};</script>
      </body>
    </html>
  `
}

export function generateInitialChunksHTML (chunkPaths) {

  // comments will be removed by shrinkPage in production
  const space = '        '
  let html = '<!-- initial chunks -->\n'
  chunkPaths.map(chunkPath => {
    html += `${space}<script defer src="${chunkPath}"></script>\n`
  })
  html += `${space}<!-- end initial chunks -->\n`
  return html
}
