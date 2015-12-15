const React = require('react')
const favicon = require('../images/favicon.png')
const styles = require('./Navbar.css')
const { Link } = require('react-router')

/*
<ul>
  <li><Link to="/" activeStyle={{ textDecoration: 'none' }}>Home</Link></li>
  <li><Link to="/about">About (lazy loaded)</Link></li>
  <li><Link to="/dashboard">Dashboard (lazy loaded)</Link></li>
  <li><Link to="/account/login">Login (lazy loaded)</Link></li>
</ul>
 */

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
  </div>
)

if (SERVER) {
  Navbar.styles = [styles.source]
}

module.exports = Navbar
