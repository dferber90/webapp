const React = require('react')
const SplitReducer = require('../components/SplitReducer')
const defaultReducer = require('../reducers/default')
const appStyles = require('./App.css')

const App = React.createClass({
  propTypes: {
    children: React.PropTypes.element,
    pending: React.PropTypes.number,
  },
  statics: {
    reducer: defaultReducer,
  },
  render() {
    return (
      <SplitReducer {...this.props}>
        {this.props.children}
      </SplitReducer>
    )
  },
})

if (SERVER) {
  App.styles = [appStyles.source]
}

module.exports = App
