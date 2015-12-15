const React = require('react')
const Navbar = require('./Navbar.js')
const Footer = require('./Footer.js')
const styles = require('./Layout.css')

const Layout = ({ children }) => (
  <div>
    <Navbar />
    <div className={styles.container}>
      {children}
    </div>
    <Footer />
  </div>
)

if (SERVER) {
  Layout.styles = [styles.source, ...Navbar.styles]
}
Layout.fetchData = [Navbar.fetchData, Footer.fetchData]

module.exports = Layout
