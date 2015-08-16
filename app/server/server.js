/**
 * Runs an express server.
 *
 * During development, a webpack-dev-server running on localhost:8080
 * forwards all requests it cannot fulfill itself to this express server.
 * The webpack-dev-server will serve the client bundles.
 */
import express from 'express'
import generatePage from './generatePage'
import bodyParser from 'body-parser'
import { graphql } from 'graphql'
import schema from 'common/graphql/schema'

const app = express()
app.use(express.static('public'))
app.use(bodyParser.text({ type: 'application/graphql' }))

app.get('*', (req, res) => {
  generatePage(req.path, req.query).then(
    html => res.end(html),
    error => res.end(error ? printError(error) : 'Could not generate page')
  )
})

app.post('/graphql', (req, res) => {
  console.log(`executing graphql request: "${req.body}"`)

  // TODO we could use the same thing with WebSockets, too
  graphql(schema, req.body).then((result) => {
    const stringifiedResult = JSON.stringify(result, null, __DEV__ ? 2 : 0)
    console.log('graphql request result:', stringifiedResult)
    res.send(stringifiedResult)
  })
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
