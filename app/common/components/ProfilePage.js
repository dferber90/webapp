import React from 'react'
import { Link } from 'react-router'

export default class ProfilePage extends React.Component {
  render () {
    return (
      <div>
        <h2>Profile Page</h2>
        <Link to="/">home</Link>
      </div>
    )
  }
}
