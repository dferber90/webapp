const jwt = require('jsonwebtoken')
const { usersCollection } = require('../../db/mongo')

module.exports = {
  post: async (req, res) => {
    const { emailAddress } = req.body

    // make sure user is not authenticated
    if (req.auth.isAuthenticated) {
      return res.json({ reason: 'already-authenticated' })
    }

    // verify no user with this emailAddress exists
    const userCount = await usersCollection.count({ emailAddress })
    console.log('userCount', userCount)
    if (userCount > 0) {
      return res.json({ reason: 'email-address-taken' })
    }

    // res.json({ reason: 'invalid-password' })
    // res.json({ reason: 'unkown-user' })

    const token = jwt.sign({}, API_SECRET, { expiresIn: '1d' })
    res.json({ token })
  },
}
