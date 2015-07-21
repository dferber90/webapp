import React, { Component } from 'react'

function getDisplayName (component) {
  return component.displayName || component.name || 'Component'
}

export default function registerReducers (reducers) {
  let hasRegistered = false
  return DecoratedComponent => (
    class RegisterReducersDecorator extends Component {
      static displayName = `Reducers(${getDisplayName(DecoratedComponent)})`
      static DecoratedComponent = DecoratedComponent;

      componentWillMount () {
        if (!hasRegistered) {
          const { storesRegistry } = this.props.route.userContext
          storesRegistry.addReducers(reducers)
          hasRegistered = true
        }
      }

      render () {
        return <DecoratedComponent {...this.props} />
      }
    }
  )
}
