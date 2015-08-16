import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Sub extends Component {
  render () {
    return (
      <div>
        <p>Sub Route</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    )
  }
}
