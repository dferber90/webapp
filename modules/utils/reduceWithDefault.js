// same as reduceReducers, but adds the default reducer at the beginning
const reduceReducers = require('./reduceReducers')
const defaultReducer = require('../reducers/default')
module.exports = (...args) => reduceReducers(defaultReducer, ...args)
