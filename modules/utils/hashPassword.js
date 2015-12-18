const { sha256 } = require('js-sha256')

function hashPassword(password) {
  return sha256(password)
}

module.exports = hashPassword
