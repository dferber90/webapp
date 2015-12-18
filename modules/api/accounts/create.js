const jwt = require('jsonwebtoken')
const r = require('rethinkdb')
const emailValidator = require('../../validation/email.js')
const mailAddressTaken = require('./utils/mailAddressTaken.js')

module.exports = {
  post: async (req, res) => {
    const { emailAddress, hashedPassword } = req.body

    // make sure user is not authenticated
    if (req.auth.isAuthenticated) {
      return res.json({ reason: 'already-authenticated' })
    }

    if (!emailValidator(emailAddress)) {
      return res.json({ reason: 'invalid-email-address' })
    }

    // verify no user with this emailAddress exists
    // TODO this isn't atomic. Use an atomic insert that throws otherwise!?
    // or check result if it can't throw
    const isMailAddressTaken = await mailAddressTaken(emailAddress, req.rdb)

    if (isMailAddressTaken) {
      return res.json({ reason: 'email-address-taken' })
    }

    const role = 'user'
    const result = await r
      .table('users')
      .insert({
        userName: '',
        firstName: '',
        lastName: '',
        role,
        photo: '',
        createdAt: new Date(),
        emailAddress,
        password: hashedPassword,
        emailVerified: false,
      })
      .run(req.rdb)

    const data = {
      userId: result.generated_keys[0],
      role,
    }

    // TODO send some emails

    // TODO have one function that takes a userId and generates a token,
    // reuse it in api/accounts/password.js
    const token = jwt.sign(data, API_SECRET, { expiresIn: '1d' })
    res.json({ token })
  },
}
