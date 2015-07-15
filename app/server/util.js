import { minify } from 'html-minifier'
import { INITIAL_DATA } from '../common/constants/initial'

export function getEntryPointFromPath (pathname) {
  if (pathname === '/') {
    console.log('main file')
    return 'landing-async'
  } else if (/^\/dashboard[\/.*]$/.test(pathname)) {
    console.log('dashboard file')
    return 'dashboard-async'
  }
  return false
}

export function getEntryPointFile (pathname) {
  const entryPoint = getEntryPointFromPath(pathname)
  if (!entryPoint) return ''

  return `<script src="/assets/${entryPoint}.chunk.js"></script>`
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

export function generateHTML (initialData, appHtml, entryPoint) {
  return `
    <html>
      <head>
        <title>testing</title>
        <script>${INITIAL_DATA} = ${JSON.stringify(initialData)};</script>
        <script src="/assets/commonsChunk.js"></script>
        <script src="/assets/app.entry.js"></script>
        ${entryPoint}
      </head>
      <body>
        <h2>hello</h2>
        <div
          id="react-app"
          style="border: 1px solid #ccc; margin: 10px; padding: 10px"
        >${appHtml}</div>
        <textarea style="width: 100%; height: 30%">${appHtml}</textarea>
        <textarea
          style="width: 100%; height: 10%"
        >${JSON.stringify(initialData)}
        </textarea>
      </body>
    </html>
  `
}
