const React = require('react')
const { Link } = require('react-router')

const Layout = ({ children }) => (
  <div>
    <h1>App</h1>
    <ul>
      <li><Link to="/" activeStyle={{ textDecoration: 'none' }}>Home</Link></li>
      <li><Link to="/about">About (lazy loaded)</Link></li>
      <li><Link to="/dashboard">Dashboard (lazy loaded)</Link></li>
      <li><Link to="/account/login">Login (lazy loaded)</Link></li>
    </ul>
    {children}
  </div>
)

module.exports = Layout
