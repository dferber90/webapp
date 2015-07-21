import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { increment } from '../../../actionCreators/counter'
import counterReducer from '../../../reducers/counter'
import registerReducers from '../../../util/registerReducers'
if (__CLIENT__) {
  require('./Dashboard.less')
}


// TODO
// this could also be one decorator of the form
// @registerAndConnect({ counter: counterReducer })
// The decorator could auto-generate the select-function for @connect
// by using the keys of the object passed to it: { counter: counterReducer }
@registerReducers({ counter: counterReducer })
@connect(state => ({ counter: state.counter }))
export default class Dashboard extends Component {

  static propTypes = {
    route: PropTypes.object.isRequired,
    counter: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { counter, dispatch } = this.props
    return (
      <div>
        <h2 className="colored">Dashboard</h2>
        <p>Counter is at {counter.value}</p>
        <button onClick={this.incrementCounter.bind(this, dispatch)}>
          inc
        </button>
        <hr/>
        <Link to="/">home</Link>
      </div>
    )
  }

  incrementCounter (dispatch) {
    dispatch(increment())
  }
}
