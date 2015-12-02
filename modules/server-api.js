// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

const express = require('express')
const bodyParser = require('body-parser')
const accountsPassword = require('./api/accounts/password')
const accountsToken = require('./api/accounts/token')
const home = require('./api/home')
const profile = require('./api/profile')
const auth = require('./api/middleware/auth.js')
const log = require('./log/api.js')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const MyGraphQLSchema = require('./graphql/schema')
const PORT = process.env.PORT || 3001
const app = express()
const router = express.Router() // eslint-disable-line new-cap

router.route('/')
  .get(home.get)

router.route('/accounts/login/password')
  .post(accountsPassword.post)

router.route('/accounts/login/token')
  .post(accountsToken.post)

router.route('/profile')
  .put(profile.put)

router.route('/profile/:id')
  .get(profile.get)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(auth)
app.use('/api/v1', router)
app.use(
  '/graphql/v1',
  graphqlHTTP(
    request => ({
      schema: MyGraphQLSchema,
      graphiql: DEVELOPMENT,
      pretty: DEVELOPMENT,
      rootValue: { // see https://github.com/graphql/express-graphql#advanced-options
        auth: request.auth,
      },
    })
  )
)

app.listen(PORT, () => log.info(`server-api listening on port ${PORT}`)) // eslint-disable-line no-console
