const React = require('react')
const favicon = require('../images/favicon.png')
const styles = require('./Navbar.css')
const { Link } = require('react-router')
const { connect } = require('react-redux')

const Navbar = ({ isAuthenticated, me }) => (
  <div className={styles.container}>
    <div className={styles.logoContainer}>
      <img className={styles.logo} src={favicon}/>
    </div>
    <div className={styles.brand}>
      <Link to="/" className={styles.brandLink}>Telescope</Link>
    </div>
    <div className={styles.space}></div>
    {isAuthenticated ? (
      <div className={styles.right}>
        <Link to="/account/login" className={styles.link}>
          {me.emailAddress}
        </Link>
      </div>
    ) : (
      <div className={styles.right}>
        <Link to="/account/login" className={styles.link}>{isAuthenticated ? me.emailAddress : 'Login'}</Link>
        {' '}
        <Link to="/account/signup" className={styles.link}>Register</Link>
      </div>
    )}
    <div className={styles.right}>
      <Link to="/submit" className={styles.submit}>POST</Link>
    </div>
  </div>
)

if (SERVER) {
  Navbar.styles = [styles.source]
}

Navbar.graphQuery = state => {
  if (state.auth.isAuthenticated) {
    return `{
      me { id, emailAddress },
    }`
  }
}

const mapStateToProps = state => {
  const { userId, isAuthenticated } = state.auth
  return {
    isAuthenticated,
    me: isAuthenticated ? state.users[userId] : {},
  }
}
module.exports = connect(mapStateToProps)(Navbar)
