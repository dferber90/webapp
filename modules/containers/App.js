const React = require('react')
const Layout = require('../components/Layout')
const SplitReducer = require('../components/SplitReducer')
const defaultReducer = require('../reducers/default')
const { connect } = require('react-redux')

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
        <Layout>
          {this.props.children}
          <p>Pending counter: {this.props.pending}</p>
        </Layout>
      </SplitReducer>
    )
  },
})

const mapStateToProps = state => ({ pending: state.pending })
module.exports = connect(mapStateToProps)(App)
