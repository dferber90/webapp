import { minify } from 'html-minifier'
import { INITIAL_DATA } from 'common/constants/initial'
import { APP_ID, DEBUG_ID } from 'common/constants/ids'

/**
 * Gets the appropriate chunk based on the request path.
 *
 * It is okay to return false. In this case webpack will request the
 * chunk when the app is loading on the client.
 * This just results in a slightly delayed request, as the request can only
 * happen after the app logic is fully loaded and executing.
 * If a string is returned, the file will be loaded instantly along with the
 * apps logic.
 *
 * Names for chunk files have to be specified in
 * `app/common/routes/<route>/index.js`.
 *
 * @param  {String} pathname Request path.
 * @return {String}          Name of corresponding chunk.
 */
export function getChunkFromPath (pathname) {
  if (pathname === '/') {
    return 'landing-async'
  } else if (/^\/dashboard[\/.*]$/.test(pathname)) {
    return 'dashboard-async'
  }
  return false
}

export function getChunkFile (pathname) {
  const initialChunk = getChunkFromPath(pathname)
  if (!initialChunk) return ''

  return `<script src="/assets/${initialChunk}.chunk.js"></script>`
}

export function shrinkPage (html) {
  // all options can be seen here
  // https://www.npmjs.com/package/html-minifier
  return minify(html, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true
  })
}

export function generateHTML ({ initialData, html, entryPoint }) {
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

  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>testing</title>
        ${assertPort}
        <script>${INITIAL_DATA} = ${JSON.stringify(initialData)};</script>
        <script src="/assets/commonsChunk.js"></script>
        <script src="/assets/app.entry.js"></script>
        ${entryPoint}
      </head>
      <body>
        <div id="${APP_ID}">${html}</div>
        ${debugPanel}
      </body>
    </html>
  `
}
