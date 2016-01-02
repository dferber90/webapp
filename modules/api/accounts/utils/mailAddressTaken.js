const r = require('rethinkdb')

function isMailAddressTaken(emailAddress, connection) {
  return r
    .table('users')
    .getAll(emailAddress.toLowerCase(), { index: 'lowerCasedEmailAddress' })
    // .filter(r.row('emailAddress').downcase().eq(emailAddress.toLowerCase()))
    .count()
    .gt(0)
    .run(connection)
}

module.exports = isMailAddressTaken
