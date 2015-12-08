const React = require('react')
const { connect } = require('react-redux')
const reduceWithDefault = require('../utils/reduceWithDefault')
const counterReducer = require('../reducers/counter')
const AboutHeading = require('../components/AboutHeading')
const IncrementButton = require('../components/IncrementButton')

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
        <AboutHeading/>
        <p>This is going to be awesome.</p>
        <p>Counter is at {this.props.counter}.</p>
        <IncrementButton handleClick={this.increment}>
          Increment
        </IncrementButton>
      </div>
    )
  },
})

module.exports = connect(
  state => ({ counter: state.counter })
)(About)
