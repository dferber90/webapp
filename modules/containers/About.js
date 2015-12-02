const React = require('react')
const { connect } = require('react-redux')
const reduceWithDefault = require('../utils/reduceWithDefault')
const counterReducer = require('../reducers/counter')

const About = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    counter: React.PropTypes.number,
  },
  statics: {
    reducer: reduceWithDefault(
      (state, action) => Object.assign({}, state, { counter: counterReducer(state.counter, action) })
    ),
  },
  increment() {
    this.props.dispatch({
      type: 'INCREMENT_COUNTER',
    })
  },
  render() {
    return (
      <div>
        <h1>About</h1>
        <p>This is going to be awesome.</p>
        <p>Counter is at {this.props.counter}.</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    )
  },
})

module.exports = connect(
  state => ({ counter: state.counter })
)(About)
