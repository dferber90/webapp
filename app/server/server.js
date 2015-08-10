/**
 * Runs an express server.
 *
 * During development, a webpack-dev-server running on localhost:8080
 * forwards all requests it cannot fulfill itself to this express server.
 * The webpack-dev-server will serve the client bundles.
 */
import express from 'express'
import generatePage from './generatePage'

const app = express()
app.use(express.static('public'))

app.get('*', (req, res) => {
  generatePage(req.path, req.query).then(
    html => res.end(html),
    error => res.end(error ? printError(error) : 'Could not generate page')
  )
})

app.listen(3000)
if (__DEV__) console.log('server listening')

function printError (error) {
  return `
    <h1>error during generatePage</h1>
    <p><b>${error.toString()}</b></p>
    <code>${error.stack}</code>
  `
}
