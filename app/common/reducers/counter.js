import { COUNTER_INCREMENT } from 'common/actionTypes/counter'
import { REHYDRATE } from 'common/actionTypes/app'

const initialState = { value: 0 }

export default function counterReducer (state = initialState, action) {
  switch (action.type) {
    case COUNTER_INCREMENT:
      return {
        ...state,
        value: state.value + 1
      }
    case REHYDRATE:
      return action.payload.counter || state
    default:
      return state
  }
}
