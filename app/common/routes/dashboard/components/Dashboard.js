import React from 'react'
import { Link } from 'react-router'
if (__CLIENT__) {
  require('./Dashboard.less')
}

export default class Dashboard extends React.Component {
  render () {
    return (
      <div>
        <h2 className="colored">Dashboard</h2>
        <Link to="/">home</Link>
      </div>
    )
  }
}
