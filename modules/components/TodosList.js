const React = require('react')

const TodosList = ({ items }) => (
  <div>
    <ul>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
)

module.exports = TodosList
