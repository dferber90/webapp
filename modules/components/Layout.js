const React = require('react')
const Navbar = require('./Navbar.js')
const Footer = require('./Footer.js')
const styles = require('./Layout.css')

const Layout = ({ className, children }) => (
  <div className={styles.layout + ' ' + className}>
    <Navbar />
    <div className={styles.container}>
      {children}
    </div>
    <Footer className={styles.footer} />
  </div>
)

if (SERVER) {
  Layout.styles = [styles.source, ...Navbar.styles, ...Footer.styles]
}
Layout.fetchData = [Navbar.fetchData, Footer.fetchData]
Layout.graphQuery = state => {
  return `
    ${Navbar.graphQuery(state)}
  `
}

module.exports = Layout
