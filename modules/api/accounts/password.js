const jwt = require('jsonwebtoken')
const r = require('rethinkdb')

module.exports = {
  post: async (req, res) => {
    // get username and hashed password from request
    const { emailAddress, hashedPassword } = req.body

    if (req.auth.isAuthenticated) {
      return res.json({ reason: 'already-authenticated' })
    }

    // make sure user exists, hashed password is correct
    let user
    try {
      user = await r
        .table('users')
        .getAll(emailAddress.toLowerCase(), { index: 'lowerCasedEmailAddress' })
        .filter({ password: hashedPassword })
        .limit(1)
        .pluck('id', 'role', 'emailAddress')
        .nth(0)
        .run(req.rdb)
    } catch (e) {
      if (e.name === 'ReqlNonExistenceError') {
        return res.json({ reason: 'bad-credentials' })
      }
      return res.status(500).json({ reason: 'server-unavailable' })
    }

    // return information to user through token
    // data in token is public!!
    const data = {
      userId: user.id,
      emailAddress: user.emailAddress,
      role: user.role,
    }

    const token = jwt.sign(data, API_SECRET, { expiresIn: '1d' })
    res.json({ token })
  },
}
