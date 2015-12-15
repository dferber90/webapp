const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const defaultReducer = require('../../reducers/default')
const Layout = require('../../components/Layout')
const SignupForm = require('./SignupForm.js')
const styles = require('./Signup.css')
const signupActionCreators = require('../../action-creators/signup.js')

const Signup = React.createClass({
  propTypes: {
    auth: React.PropTypes.object.isRequired,
    createAccount: React.PropTypes.func.isRequired,
  },
  statics: {
    reducer: defaultReducer,
  },
  handleSubmission({ emailAddress, password }) {
    this.props.createAccount(emailAddress, password)
  },
  render() {
    return (
      <Layout>
        <SignupForm onSubmit={this.handleSubmission}/>
      </Layout>
    )
  },
})

if (SERVER) {
  Signup.styles = [styles.source, ...Layout.styles, SignupForm.styles]
}

const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators(signupActionCreators, dispatch)
module.exports = connect(mapStateToProps, mapDispatchToProps)(Signup)
