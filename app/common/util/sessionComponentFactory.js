import React, { Component } from 'react'

/**
 * Factory for Higher-order Component that adds session as prop
 * @param  {Object} session Session data
 * @return {Function}         Higher-order Component
 */
export default function (session) {

  /*
   * Higher-order Component that adds session as prop
   *
   * This HoC is dynamically created for each user's session
   */
  return ComposedComponent => class extends Component {
    render () {
      return <ComposedComponent {...this.props} session={session}/>
    }
  }
}
