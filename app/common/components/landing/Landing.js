import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { addTodo, removeTodo } from 'common/actionCreators/todos'
import todosReducer from 'common/reducers/todos'
import registerReducers from 'common/util/registerReducers'
import TodoItem from './TodoItem'

@registerReducers({ todos: todosReducer })
@connect(state => ({ todos: state.todos }))
export default class Landing extends Component {

  static propTypes = {
    todos: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { todos, dispatch } = this.props
    return (
      <div>
        <h2>Landing</h2>
        <ul>
          {todos.todoList.map((todo) =>
            <TodoItem
              key={todo.id}
              text={todo.text}
              onClickHandler={
                this.removeTodo.bind(this, todo.id, dispatch)
              }
            />
          )}
        </ul>
        <button onClick={this.addTodo.bind(this, dispatch)}>
          add todo
        </button>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    )
  }

  addTodo (dispatch) {
    const name = prompt('name?') // eslint-disable-line no-alert
    dispatch(addTodo(name))
  }

  removeTodo (todoId, dispatch) {
    dispatch(removeTodo(todoId))
  }

  renderTodo (todo) {
    return <li>{todo.text}</li>
  }
}
