import { ADD_TODO, REMOVE_TODO } from 'common/actionTypes/todos'

const initialTodos = [
  { id: 0, text: 'TODO #0' },
  { id: 1, text: 'TODO #1' }
]
const initialState = { todoList: initialTodos, idCounter: 1 }

export default function todoReducer (state = initialState, action) {

  // Example of how to have parts of the reducer specific to client or server:
  //
  // if (__SERVER__) {
  //   const { ADD_TODO_SERVER } = require('common/actionTypes/todos')
  //   switch (action.type) {
  //     case ADD_TODO_SERVER:
  //       return state
  //   }
  // }

  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todoList: [
          ...state.todoList,
          { text: action.payload.text, id: state.idCounter + 1 }
        ],
        idCounter: state.idCounter + 1
      }
    case REMOVE_TODO:
      return {
        ...state,
        todoList: state.todoList.filter(todo => todo.id !== action.payload.id)
      }
    default:
      return state
  }
}
