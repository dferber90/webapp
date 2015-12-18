const jwt = require('jsonwebtoken')
const { serialize } = require('cookie')
const moment = require('moment')
const { pushPath } = require('redux-simple-router')

const apiClient = require('../api-client')

const localStorageTokenKey = 'token'
const defaultCookieOptions = {
  path: '/',
  httpOnly: false,
  secure: false,
  // domain: document.location.hostname, // setting domain explicitly allows subdomains
}


// ----------------------------------------------------------------------------
// Action Creators: Sync
// ----------------------------------------------------------------------------
const setRedirectLocation = locationPath => ({ type: 'AUTH_SET_REDIRECT_LOCATION', payload: locationPath })

const loginSuccess = (token, redirectLocation) => dispatch => {
  const successfullLoginAction = {
    type: 'AUTH_LOGIN_SUCCESS',
    payload: {
      token,
      tokenContents: jwt.decode(token),
    },
  }

  if (redirectLocation) {
    dispatch(successfullLoginAction)
    return dispatch(pushPath(redirectLocation))
  }
  return dispatch(successfullLoginAction)
}

const loginStoreToken = (token, redirectLocation = false) => dispatch => {
  if (CLIENT) {
    localStorage.setItem(localStorageTokenKey, token)
    document.cookie = serialize('token', token, {
      ...defaultCookieOptions,
      expires: moment().add(1, 'month').toDate(),
    })
  }
  return dispatch(loginSuccess(token, redirectLocation))
}

const loginError = (error) => ({ type: 'AUTH_LOGIN_ERROR', payload: error })

const logout = () => {
  if (CLIENT) {
    localStorage.removeItem(localStorageTokenKey)
    document.cookie = serialize('token', '', {
      ...defaultCookieOptions,
      expires: moment().add(-1, 'year').toDate(),
    })
  }
  return { type: 'AUTH_LOGOUT' }
}

// ----------------------------------------------------------------------------
// Action Creators: Async
// ----------------------------------------------------------------------------
const login = (emailAddress, hashedPassword, redirectLocation) => dispatch => {
  dispatch({ type: 'AUTH_LOGIN_ATTEMPT' })

  return apiClient({
    endpoint: 'accounts/login/password',
    body: { emailAddress, hashedPassword },
  })
  .then(response => dispatch(loginSuccess(response.token, redirectLocation)))
  .catch(error => {
    dispatch(loginError(error))
    if (error && error.reason === 'bad-credentials') {
      throw {
        _error: 'Login failed!',
        password: 'Looks like you had the wrong password',
      }
    }
  })
}


module.exports = {
  loginStoreToken,
  loginSuccess,
  login,
  logout,
  setRedirectLocation,
}
