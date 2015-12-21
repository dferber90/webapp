const React = require('react')
const { connect } = require('react-redux')
const LoginForm = require('../../components/accounts/LoginForm')
const authActionCreators = require('../../action-creators/auth')
const defaultReducer = require('../../reducers/default')
const Layout = require('../../components/Layout')
const hashPassword = require('../../utils/hashPassword')

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
  handleSubmit({ emailAddress, password }) {
    const hashedPassword = hashPassword(password)
    return this.props.login(emailAddress, hashedPassword, this.props.auth.redirectLocation)
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
        onSubmit={this.handleSubmit}
        isAuthenticating={this.props.auth.isAuthenticating}
      />
    )
  },
  render() {
    const { userId } = this.props.auth
    return userId ? this.renderLoggedIn() : this.renderLoginForm()
  },
})

if (SERVER) {
  Login.styles = [...Layout.styles, ...LoginForm.styles]
}

module.exports = connect(
  state => ({ auth: state.auth }),

  // binds addTodo to dispatch and adds it to props
  authActionCreators // passing object directly binds action creators automatically
)(Login)
