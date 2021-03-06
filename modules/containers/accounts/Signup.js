const React = require('react')
const { connect } = require('react-redux')
const defaultReducer = require('../../reducers/default')
const SignupForm = require('../../components/accounts/SignupForm')
const { createAccount } = require('../../action-creators/accounts/create')
const { logout } = require('../../action-creators/auth')

const Signup = React.createClass({
  propTypes: {
    auth: React.PropTypes.object.isRequired,
    createAccount: React.PropTypes.func.isRequired,
    logout: React.PropTypes.func.isRequired,
  },
  statics: {
    reducer: defaultReducer,
  },
  handleSubmission({ emailAddress, password }) {
    this.props.createAccount(emailAddress, password)
  },
  renderAlreadyAuthenticated() {
    return (
      <div>
        <p>Already authenticated.</p>
        <button onClick={this.props.logout}>Logout</button>
      </div>
    )
  },
  renderLoginForm() {
    return <SignupForm onSubmit={this.handleSubmission}/>
  },
  render() {
    return this.props.auth.isAuthenticated ? this.renderAlreadyAuthenticated() : this.renderLoginForm()
  },
})

if (SERVER) {
  Signup.styles = [...SignupForm.styles]
}

const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => ({
  createAccount: (...args) => dispatch(createAccount(...args)),
  logout: (...args) => dispatch(logout(...args)),
})
module.exports = connect(mapStateToProps, mapDispatchToProps)(Signup)
