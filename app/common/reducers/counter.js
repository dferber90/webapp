import { COUNTER_INCREMENT } from 'common/actionTypes/counter'

const initialState = { value: 0 }

export default function counterReducer (state = initialState, action) {
  switch (action.type) {
    case COUNTER_INCREMENT:
      return {
        ...state,
        value: state.value + 1
      }
    default:
      return state
  }
}
