/*
 * Flow of authentication
 *   Has login token                         Has no login token
 *       |                                        |
 *  loginSuccess(token)                  login(username, pwd, redirectLocation)
 *                                               / \
 *                                              /   \
 *                                             /     \
 *                                            /       \
 *       loginStoreToken(token, redirectLocation)    loginError(error)
 *                                          /
 *        loginSuccess(token, redirectLocation)
 */

const defaultState = {
  token: false,
  userId: false,
  role: 'anonymous',
  isAuthenticated: false,
  isAuthenticating: false,
  failReason: '',
  redirectLocation: false, // where the user will be taken after successful login
}

function auth(state = defaultState, action) {
  switch (action.type) {
    case 'AUTH_LOGIN_ATTEMPT':
      return {
        ...state,
        isAuthenticating: true,
        failReason: '',
      }
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.tokenContents.userId,
        role: action.payload.tokenContents.role,
        isAuthenticated: true,
        isAuthenticating: false,
        failReason: '',
        redirectLocation: false,
      }
    case 'AUTH_LOGIN_ERROR':
      return {
        ...state,
        token: false,
        userId: false,
        role: 'anonymous',
        isAuthenticated: false,
        isAuthenticating: false,
        failReason: action.payload.reason,
      }
    case 'AUTH_LOGOUT':
      return {
        ...state,
        token: false,
        userId: false,
        role: 'anonymous',
        isAuthenticated: false,
        isAuthenticating: false,
        failReason: '',
      }
    case 'AUTH_SET_REDIRECT_LOCATION':
      return {
        ...state,
        redirectLocation: action.payload,
      }
    default:
      return state
  }
}

module.exports = auth
