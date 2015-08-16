import React, { Component } from 'react'

/**
 * Factory for Higher-order Component that adds props
 * @param  {Object} props Props to add
 * @return {Function}         Higher-order Component
 */
export default function (props) {

  /*
   * Higher-order Component that adds props to the original components
   */
  return ComposedComponent => class extends Component {
    render () {
      return <ComposedComponent {...this.props} {...props}/>
    }
  }
}
