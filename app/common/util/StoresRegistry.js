/**
 * Enables lazy registration of reducers.
 */

import { combineReducers } from 'redux'
import finalCreateStore from '../util/finalCreateStore'

export default class StoresRegistry {

  constructor (initialReducers = {}, initialState = {}) {
    this.store = undefined
    this.reducers = initialReducers
    this.store = finalCreateStore(combineReducers(this.reducers), initialState)
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
