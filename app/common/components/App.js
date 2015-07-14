import React from 'react'
import { Link } from 'react-router'

export default class App extends React.Component {

  render () {
    return (
      <div>
        <p>App</p>
        <ul>
          <li><Link to="/landing">Landing</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </div>
    )
  }

}
