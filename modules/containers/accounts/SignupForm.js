const React = require('react')
const { reduxForm } = require('redux-form')
const styles = require('./SignupForm.css')

const SignupForm = React.createClass({
  propTypes: {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func, // passed in from reduxForm, can't be marked as `isRequired`
  },
  render() {
    const { fields: { emailAddress, password } } = this.props
    return (
      <form onSubmit={this.props.handleSubmit} className={styles.form}>
        <label htmlFor="emailAddress">Email Address</label><br/>
        <input id="emailAddress" type="text" {...emailAddress}/>
        <br/>
        <br/>
        <label htmlFor="password">Password</label><br/>
        <input id="password" type="password" {...password}/>
        <br/>
        <br/>
        <input type="submit" value="Register"/>
      </form>
    )
  },
})

if (SERVER) {
  SignupForm.styles = [styles.source]
}

module.exports = reduxForm({
  form: 'signup',
  fields: ['username', 'emailAddress'],
})(SignupForm)
