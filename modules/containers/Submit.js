const React = require('react')
const { connect } = require('react-redux')
// const reduceWithDefault = require('../utils/reduceWithDefault')

const Submit = React.createClass({
  propTypes: {
    // dispatch: React.PropTypes.func,
  },
  statics: {
    // reducer: reduceWithDefault(
      // (state, action) => Object.assign({}, state, { counter: counterReducer(state.counter, action) })
    // ),
  },
  render() {
    return (
      <div>
        <p>Submit a post.</p>
      </div>
    )
  },
})

module.exports = connect(
  state => state
)(Submit)
