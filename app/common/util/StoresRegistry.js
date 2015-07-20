import { combineReducers, compose, createStore } from 'redux'

let store
let reducers = {}


const defaultOptions = { refresh: true }
export function addReducers (newReducers, { refresh } = defaultOptions) {
  reducers = {
    ...reducers,
    ...newReducers
  }
  if (refresh) refreshReducers()
}

export function refreshReducers () {
  if (store) {
    store.replaceReducer(combineReducers(reducers))
  } else {
    throw new Error('no store yet')
  }
}


let finalCreateStore
if (__DEV__ && __DEVTOOLS__) {
  const { devTools } = require('redux-devtools')
  finalCreateStore = compose(
    devTools(),
    createStore
  )
} else {
  finalCreateStore = createStore
}
export function init (initialReducers = {}, initialState = {}) {
  addReducers(initialReducers, { refresh: false })
  store = finalCreateStore(combineReducers(reducers), initialState)
  return store
}
