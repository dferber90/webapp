import React, { Component, PropTypes } from 'react'
import Router from 'react-router'

// generate proptypes based on environment
const propTypes = {}
if (__SERVER__) {
  propTypes.server = PropTypes.shape({
    params: PropTypes.object.isRequired,
    branch: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired
  })
}

if (__CLIENT__) {
  propTypes.client = PropTypes.shape({
    history: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    createElement: PropTypes.func.isRequired
  })
}

export default class App extends Component {
  static propTypes = propTypes

  render () {

    // include props based on environment
    let props = {}
    if (__CLIENT__) props = this.props.client
    else if (__SERVER__) props = this.props.server
    return <Router {...props}/>
  }
}
