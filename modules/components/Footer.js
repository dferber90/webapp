const React = require('react')
const styles = require('./Footer.css')

const Footer = ({ className }) => (
  <div className={className + ' ' + styles.footer}>&copy; nobody Inc.</div>
)


if (SERVER) {
  Footer.styles = [styles.source]
}

module.exports = Footer
