const mongo = require('promised-mongo')
const db = mongo('mongodb://localhost:27017/app')

// TODO if the mongo db is unreachable on startup, the app will never connect
// if mongodb fails during execution, it will also never reconnect
/*
not supported by promised-mongo
db.on('error', (err) => {
  console.warn('database error', err) // eslint-disable-line no-console
})

db.on('connect', () => {
  console.warn('database connected') // eslint-disable-line no-console
})
*/

module.exports = {
  db,
  todosCollection: db.collection('todos'),
  usersCollection: db.collection('users'),
  // postsCollection: db.collection('posts'),
  // commentsCollection: db.collection('comments'),
}
