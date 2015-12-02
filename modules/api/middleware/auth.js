const { tokenToAuth } = require('../../utils/token.js')

function getTokenFromAuthHeader(authorization) {
  if (!authorization) return false
  if (!/^Bearer /.test(authorization)) return false
  return authorization.replace(/^Bearer /, '')
}

const authenticationMiddleware = (req, res, next) => {
  const token = getTokenFromAuthHeader(req.headers.authorization)
  req.auth = tokenToAuth(token)
  next()
}

module.exports = authenticationMiddleware
