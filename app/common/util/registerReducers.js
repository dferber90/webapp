import React, { Component } from 'react'

// duplicated from
// github.com/gaearon/react-redux/blob/master/src/utils/getDisplayName.js
function getDisplayName (component) {
  return component.displayName || component.name || 'Component'
}

export default function registerReducers (reducers) {
  return WrappedComponent => (
    class RegisterReducersDecorator extends Component {
      static displayName = `Reducers(${getDisplayName(WrappedComponent)})`
      static WrappedComponent = WrappedComponent;

      componentWillMount () {
        const { storesRegistry } = this.props.route.userContext
        storesRegistry.addReducers(reducers)
      }

      render () {
        return <WrappedComponent {...this.props} />
      }
    }
  )
}
