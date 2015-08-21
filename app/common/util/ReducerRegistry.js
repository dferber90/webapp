/**
 * Enables lazy registration of reducers.
 */

import { combineReducers } from 'redux'
import finalCreateStore from 'common/util/finalCreateStore'

export default class ReducerRegistry {

  constructor (initialReducers = {}) {
    this.reducers = initialReducers
    this.store = finalCreateStore(combineReducers(this.reducers))
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
      this.store.replaceReducer(combineReducers(this.reducers))
    } else {
      throw new Error('no store yet')
    }
  }
}
