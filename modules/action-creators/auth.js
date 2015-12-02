const jwt = require('jsonwebtoken')
const { serialize } = require('cookie')
const moment = require('moment')
const fetch = require('isomorphic-fetch')
const { checkHttpStatus, parseJSON } = require('../utils/fetch-utils.js')
const { updatePath } = require('redux-simple-router')

const API_URL = 'http://localhost:3001/api/v1'
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
      token: token,
      tokenContents: jwt.decode(token),
    },
  }

  if (redirectLocation) {
    dispatch(successfullLoginAction)
    return dispatch(updatePath(redirectLocation))
  }
  return dispatch(successfullLoginAction)
}

const loginStoreToken = (token, redirectLocation = false) => dispatch => {
  if (CLIENT) {
    localStorage.setItem(localStorageTokenKey, token)
    document.cookie = serialize('token', token, {
      ...defaultCookieOptions,
      expires: moment().add(1, 'day').toDate(),
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
const login = (emailOrUsername, hashedPassword, redirectLocation) => dispatch => {
  dispatch({ type: 'AUTH_LOGIN_ATTEMPT' })

  dispatch(
    fetch(`${API_URL}/accounts/login/password`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrUsername, hashedPassword }),
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => dispatch(loginSuccess(response.token, redirectLocation)))
    .catch(error => dispatch(loginError(error)))
  )
}


module.exports = {
  loginStoreToken,
  login,
  logout,
  setRedirectLocation,
}
