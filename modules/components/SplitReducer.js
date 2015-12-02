const React = require('react')
const findAndReplaceReducerFromComponents = require('../utils/findAndReplaceReducerFromComponents')

const SplitReducer = React.createClass({
  propTypes: {
    history: React.PropTypes.object,
    location: React.PropTypes.object,
    children: React.PropTypes.element,
  },
  contextTypes: {
    store: React.PropTypes.object,
  },

  componentWillMount() {
    const { history, location } = this.props
    this.updateReducerFromComponents(history, location)
  },

  componentWillReceiveProps(nextProps) {
    const { history, location } = nextProps
    this.updateReducerFromComponents(history, location)
  },

  updateReducerFromComponents(history, location) {
    const { replaceReducer } = this.context.store
    history.match(location, (error, redirectLocation, renderProps) => {
      findAndReplaceReducerFromComponents(renderProps.components, replaceReducer)
    })
  },

  render() {
    return this.props.children
  },
})

module.exports = SplitReducer
