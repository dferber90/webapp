const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const LoginForm = require('../components/LoginForm')
const authActionCreators = require('../action-creators/auth')
const defaultReducer = require('../reducers/default')
const Layout = require('../components/Layout')

function hashPassword(password) {
  return password + '-hashed'
}

const Login = React.createClass({
  propTypes: {
    auth: React.PropTypes.object,
    login: React.PropTypes.func,
    logout: React.PropTypes.func,
    location: React.PropTypes.object,
  },
  statics: {
    reducer: defaultReducer,
  },
  handleSubmit(emailOrUsername, password) {
    const hashedPassword = hashPassword(password)
    this.props.login(emailOrUsername, hashedPassword, this.props.auth.redirectLocation)
  },
  renderLoggedIn() {
    const { userId } = this.props.auth
    return (
      <div>
        <p>Welcome {userId}</p>
        <button onClick={this.props.logout}>Logout</button>
      </div>
    )
  },
  renderLoginForm() {
    return (
      <LoginForm
        handleSubmit={this.handleSubmit}
        isAuthenticating={this.props.auth.isAuthenticating}
      />
    )
  },
  render() {
    const { userId } = this.props.auth
    return (
      <Layout>
        {userId ? this.renderLoggedIn() : this.renderLoginForm()}
      </Layout>
    )
  },
})

if (SERVER) {
  Login.styles = [...Layout.styles]
}

module.exports = connect(
  state => ({ auth: state.auth }),

  // binds addTodo to dispatch and adds it to props
  dispatch => bindActionCreators(authActionCreators, dispatch)
)(Login)
