const jwt = require('jsonwebtoken')

module.exports = {
  post: (req, res) => {
    // get username and hashed password from request
    // make sure user exists, hashed password is correct

    // return token and information to user
    // data in token is public!!
    const data = {
      userId: 1,
      role: 'admin',
    }

    // res.json({ reason: 'invalid-password' })
    // res.json({ reason: 'unkown-user' })

    const token = jwt.sign(data, API_SECRET, { expiresIn: '1d' })
    res.json({ token })
  },
}
