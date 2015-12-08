const React = require('react')

module.exports = ({ handleClick, children }) => <button onClick={handleClick}>{children}</button>
