import React from 'react'
import { Link } from 'react-router'

export default class Landing extends React.Component {
  render () {
    return (
      <div>
        <h2>Landing :)</h2>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    )
  }
}
