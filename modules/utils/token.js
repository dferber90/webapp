const jwt = require('jsonwebtoken')

function verifyAndDecode(token) {
  try {
    const decoded = jwt.verify(token, API_SECRET)
    return [true, decoded]
  } catch (err) {
    return [false]
  }
}

function tokenToAuth(token) {
  const [isAuthenticated, data] = verifyAndDecode(token)
  return isAuthenticated ?
    { isAuthenticated: true, userId: data.userId } :
    { isAuthenticated: false, userId: false }
}

module.exports = {
  verifyAndDecode,
  tokenToAuth,
}
