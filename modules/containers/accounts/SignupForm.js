const React = require('react')
const { reduxForm } = require('redux-form')
const styles = require('./SignupForm.css')
const emailValidator = require('../../validation/email')
const passwordValidator = require('../../validation/password')
const apiClient = require('../../api-client')

const asyncValidate = values => {
  if (!values.emailAddress) {
    return {}
  }

  return (
    apiClient({
      endpoint: 'accounts/exists',
      body: { emailAddress: values.emailAddress },
      onSuccess: response => response.taken ? { emailAddress: 'That email address is already taken' } : {},
      onError: () => ({ emailAddress: 'API unavailable.' }),
    })
  )
}


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

const SignupForm = React.createClass({
  propTypes: {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func, // passed in from reduxForm, can't be marked as `isRequired`
    submitting: React.PropTypes.bool.isRequired,
    asyncValidating: React.PropTypes.bool.isRequired,
  },
  render() {
    const {
      fields: { emailAddress, password },
      submitting,
      asyncValidating,
    } = this.props
    return (
      <form onSubmit={this.props.handleSubmit} className={styles.form}>
        <label htmlFor="emailAddress">Email Address</label><br/>
        <input id="emailAddress" type="text" {...emailAddress}/>
        {emailAddress.touched && emailAddress.error && <div>{emailAddress.error}</div>}
        <br/>
        <br/>
        <label htmlFor="password">Password</label><br/>
        <input id="password" type="password" {...password}/>
        {password.touched && password.error && <div>{password.error}</div>}
        <br/>
        <br/>
        <input type="submit" value="Register" disabled={submitting || asyncValidating}/>
      </form>
    )
  },
})

if (SERVER) {
  SignupForm.styles = [styles.source]
}

module.exports = reduxForm({
  form: 'signup',
  fields: ['emailAddress', 'password'],
  validate,
  asyncValidate,
  asyncBlurFields: ['emailAddress'],
})(SignupForm)
