const React = require('react')
const { reduxForm } = require('redux-form')
const emailValidator = require('../../validation/email')
const passwordValidator = require('../../validation/password')
const styles = require('./LoginForm.css')

const validate = values => {
  const errors = {}
  if (!values.emailAddress) {
    errors.emailAddress = 'Required'
  } else if (!emailValidator(values.emailAddress)) {
    errors.emailAddress = 'Invalid email address'
  }
  if (!values.password) {
    errors.password = 'Required'
  } else if (!passwordValidator(values.password)) {
    errors.password = 'Must be 2 characters or more'
  }
  return errors
}

const LoginForm = React.createClass({
  propTypes: {
    fields: React.PropTypes.object.isRequired,
    error: React.PropTypes.string,
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    asyncValidating: React.PropTypes.bool.isRequired,
  },
  render() {
    const {
      fields: { emailAddress, password },
      error,
      submitting,
      asyncValidating,
      handleSubmit,
    } = this.props
    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="emailAddress">Email Address</label><br/>
        <input id="emailAddress" type="text" {...emailAddress}/><br/>
        {emailAddress.touched && emailAddress.error && <div>{emailAddress.error}</div>}
        <br/><br/>
        <label htmlFor="password">Password</label><br/>
        <input id="password" type="password" {...password}/><br/>
        {password.touched && password.error && <div>{password.error}</div>}
        <p>{error || ' '}</p>
        <input type="submit" value="login" disabled={submitting || asyncValidating}/>
      </form>
    )
  },
})

if (SERVER) {
  LoginForm.styles = [styles.source]
}

module.exports = reduxForm({
  form: 'signup',
  fields: ['emailAddress', 'password'],
  validate,
  asyncBlurFields: ['emailAddress'],
})(LoginForm)
