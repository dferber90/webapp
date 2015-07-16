import React, { Component } from 'react'
import { Link } from 'react-router'
import { Connector } from 'react-redux'
import { increment } from '../../../actionCreators/counter'
if (__CLIENT__) {
  require('./Dashboard.less')
}

function select (state) {
  return { counter: state.counter }
}

export default class Dashboard extends Component {
  render () {
    return (
      <Connector select={select}>
        {({ counter, dispatch }) =>
          <div>
            <h2 className="colored">Dashboard</h2>
            <p>Counter is at {counter.value}</p>
            <button onClick={this.incrementCounter.bind(this, dispatch)}>
              inc
            </button>
            <hr/>
            <Link to="/">home</Link>
          </div>
        }
      </Connector>
    )
  }

  incrementCounter (dispatch) {
    dispatch(increment())
  }
}
