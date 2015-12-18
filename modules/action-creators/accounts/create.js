const apiClient = require('../../api-client')
const { loginStoreToken } = require('../auth')

function hashPassword(password) {
  return password + '-hashed'
}

const createAccountSuccess = token => loginStoreToken(token, '/')
const createAccountFailure = error => ({ type: 'SIGNUP/ERROR', error: true, payload: error })

const createAccount = (emailAddress, password) => dispatch => {
  const hashedPassword = hashPassword(password)
  return (
    apiClient({
      endpoint: 'accounts/create',
      body: { emailAddress, hashedPassword },
      onSuccess: response => {
        if (response.reason) {
          dispatch(createAccountFailure(response.reason))
        } else if (response.token) {
          dispatch(createAccountSuccess(response.token))
        }
      },
      onError: error => dispatch(createAccountFailure(error)),
    })
  )
}

module.exports = {
  createAccount,
  createAccountSuccess,
  createAccountFailure,
}
