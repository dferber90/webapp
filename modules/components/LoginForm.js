const React = require('react')
const ReactDOM = require('react-dom')

const LoginForm = React.createClass({
  propTypes: {
    handleSubmit: React.PropTypes.func,
    isAuthenticating: React.PropTypes.bool,
  },
  getInitialState() {
    return { username: '', password: '' }
  },
  onSubmit(event) {
    event.preventDefault()
    const { emailAddress, password } = this.state
    if (emailAddress.length > 0 && password.length > 0) {
      this.props.handleSubmit(emailAddress, password)
    }
    this.setState({ emailAddress: '', password: '' })
    ReactDOM.findDOMNode(this.emailAddress).focus()
  },
  changeEmailAddress() {
    this.setState({ emailAddress: this.emailAddress.value.trim() })
  },
  changePassword() {
    this.setState({ password: this.password.value.trim() })
  },
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="emailAddress">Username</label><br/>
      <input id="emailAddress" type="text" ref={node => this.emailAddress = node} value={this.state.emailAddress} onChange={this.changeEmailAddress}/><br/><br/>
        <label htmlFor="password">Password</label><br/>
        <input id="password" type="password" ref={node => this.password = node} value={this.state.password} onChange={this.changePassword}/><br/><br/>
        <input type="submit" value="login" disabled={this.props.isAuthenticating}/>
      </form>
    )
  },
})


// same but without state
/*
const LoginForm = React.createClass({
  propTypes: {
    handleSubmit: React.PropTypes.func,
    isAuthenticating: React.PropTypes.bool,
  },
  onSubmit(event) {
    event.preventDefault()
    const username = this.username.value.trim()
    const password = this.password.value.trim()
    if (username.length > 0 && password.length > 0) {
      this.props.handleSubmit(username, password)
    }
    this.username.value = ''
    this.password.value = ''
    ReactDOM.findDOMNode(this.username).focus()
  },
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="username">Username</label><br/>
        <input id="username" type="text" ref={node => this.username = node}/><br/><br/>
        <label htmlFor="password">Password</label><br/>
        <input id="password" type="password" ref={node => this.password = node}/><br/><br/>
        <input type="submit" value="login" disabled={this.props.isAuthenticating}/>
      </form>
    )
  },
})
*/

module.exports = LoginForm
