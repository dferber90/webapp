import React, { Component, PropTypes } from 'react'
import Router from 'react-router'

const serverPropsShape = PropTypes.shape({
  params: PropTypes.object,
  branch: PropTypes.array,
  location: PropTypes.object,
  components: PropTypes.array
})

const clientPropsShape = PropTypes.shape({
  history: PropTypes.object,
  children: PropTypes.object,
  createElement: PropTypes.func
})

export default class App extends Component {
  static propTypes = {
    server: serverPropsShape,
    client: clientPropsShape,
    store: PropTypes.object.isRequired
  }

  render () {
    return <Router {...this.props.client} {...this.props.server} />
  }
}
