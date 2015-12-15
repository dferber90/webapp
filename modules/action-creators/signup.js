const fetch = require('isomorphic-fetch')
const API_URL = 'http://localhost:3001/api/v1'
const { checkHttpStatus, parseJSON } = require('../utils/fetch-utils.js')

function hashPassword(password) {
  return password + '-hashed'
}

// TODO this should be a token so the user can be logged in automatically
const createAccountSuccess = (userId) => ({ type: 'SIGNUP/SUCCESS', payload: userId })
const createAccountFailure = (error) => ({ type: 'SIGNUP/ERROR', error: true, payload: error })

const createAccount = (emailAddress, password) => dispatch => {
  const hashedPassword = hashPassword(password)
  return dispatch(
    fetch(`${API_URL}/accounts/create`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailAddress, hashedPassword }),
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => dispatch(createAccountSuccess(response)))
    .catch(error => dispatch(createAccountFailure(error)))
  )
}

module.exports = {
  createAccount,
  createAccountSuccess,
  createAccountFailure,
}
