const React = require('react')
const favicon = require('../images/favicon.png')
const styles = require('./Navbar.css')
const { Link } = require('react-router')

const Navbar = () => (
  <div className={styles.container}>
    <div className={styles.logoContainer}>
      <img className={styles.logo} src={favicon}/>
    </div>
    <div className={styles.brand}>
      <Link to="/" className={styles.brandLink}>Telescope</Link>
    </div>
    <div className={styles.space}></div>
    <div className={styles.right}>
      <Link to="/account/login" className={styles.link}>Login</Link>
    </div>
    <div className={styles.right}>
      <Link to="/account/signup" className={styles.link}>Sign up</Link>
    </div>
    <div className={styles.right}>
      <Link to="/submit" className={styles.submit}>POST</Link>
    </div>
  </div>
)

if (SERVER) {
  Navbar.styles = [styles.source]
}

module.exports = Navbar
