const r = require('rethinkdb')

const DATABASE_NAME = 'app'


const rawConnection = r.connect({
  host: 'localhost',
  port: 28015,
  db: DATABASE_NAME,
})

;(async function initializeRethinkDB() {
  const expectReqlOpFailedError = error => {
    if (error.name !== 'ReqlOpFailedError') throw error
  }

  let connection
  try {
    connection = await rawConnection
  } catch (e) {
    // TODO maybe try to reconnect after exponential-backoff?
    throw e
  }

  // create the database in case it doesn't exist
  try {
    await r.dbCreate(DATABASE_NAME).run(connection)
    console.log('database app created') // eslint-disable-line no-console
  } catch (e) {
    expectReqlOpFailedError(e)
  }

  // create the `users` table in case it doesn't exist
  const db = r.db(DATABASE_NAME)
  try {
    const options = {
      primaryKey: 'id', // this is the default, but specify as an example
    }
    await db.tableCreate('users', options).run(connection)
  } catch (e) {
    expectReqlOpFailedError(e)
  }

  try {
    await db.table('users')
      .indexCreate('lowerCasedEmailAddress', user => user('emailAddress').downcase())
      .run(connection)
  } catch (e) {
    expectReqlOpFailedError(e)
  }

  // add more tables with different options (indexes etc)
  // ..
})()

// taken from https://rethinkdb.com/docs/examples/node-todo-promises/
function createRethinkDBConnection(req, res, next) {
  rawConnection
    .then(connection => {
      req.rdb = connection
      next()
    })
    .error(error => res.send(500, { error: error.message }))
}


module.exports = {
  rawConnection,
  r,
  createRethinkDBConnection,
}
