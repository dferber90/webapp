import React, { PropTypes } from 'react'
import { Link } from 'react-router'


export default class LandingPage extends React.Component {
  constructor () {
    super()
    this.state = { count: 0 }
  }

  static propTypes = { initialCount: PropTypes.string }

  increment () { this.setState({ count: this.state.count + 1 }) }
  decrement () { this.setState({ count: this.state.count - 1 }) }

  render () {
    return (
      <div>
        <p>Hello, world! I am a LandingPage 29</p>
        <p>
          current count is at {this.state.count}.
          Initial Value: {this.props.initialCount}.
        </p>
        <button onClick={this.increment.bind(this)}>increment</button>
        <button onClick={this.decrement.bind(this)}>decrement</button>
        <p><Link to="/profile">ProfilePage</Link></p>
      </div>
    )
  }
}
