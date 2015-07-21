import React, { Component } from 'react'

function getDisplayName (component) {
  return component.displayName || component.name || 'Component'
}

export default function registerReducers (reducers) {
  return DecoratedComponent => (
    class RegisterReducersDecorator extends Component {
      static displayName = `Reducers(${getDisplayName(DecoratedComponent)})`
      static DecoratedComponent = DecoratedComponent;

      componentWillMount () {
        const { storesRegistry } = this.props.route.userContext
        storesRegistry.addReducers(reducers)
      }

      render () {
        return <DecoratedComponent {...this.props} />
      }
    }
  )
}
