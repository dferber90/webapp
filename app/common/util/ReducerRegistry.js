/**
 * Enables lazy registration of reducers.
 */

import { combineReducers, compose } from 'redux'
import finalCreateStore from 'common/util/finalCreateStore'

const REHYDRATE = '@@REHYDRATE'

const rehydrateReducer = next => (state, action) => {
  if (action.type === REHYDRATE) {
    const newState = { ...state, ...action.payload } // eslint-disable-line computed-property-spacing, max-len
    return next(newState, action)
  } else {
    return next(state, action)
  }
}

export default class ReducerRegistry {

  constructor (initialReducers = {}) {
    this.reducers = initialReducers
    this.store = finalCreateStore(this._combineReducers())
  }

  rehydrate (data) {
    return this.store.dispatch({
      type: REHYDRATE,
      payload: data
    })
  }

  _combineReducers () {
    return compose(
      rehydrateReducer,
      combineReducers(this.reducers)
    )
  }

  addReducers (newReducers, { refresh } = { refresh: true }) {
    this.reducers = {
      ...this.reducers,
      ...newReducers
    }
    if (refresh) this.refreshReducers()
  }

  refreshReducers () {
    if (this.store) {
      this.store.replaceReducer(this._combineReducers())
    } else {
      throw new Error('no store yet')
    }
  }
}
