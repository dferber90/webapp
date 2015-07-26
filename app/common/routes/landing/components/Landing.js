import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { Connector } from 'react-redux'
import { addTodo, removeTodo } from '../../../actionCreators/todos'
import todosReducer from '../../../reducers/todos'


function select (state) {
  return { todos: state.todos }
}

export default class Landing extends Component {

  static propTypes = {
    route: PropTypes.object.isRequired
  }

  componentWillMount () {
    // TODO only register reducer on first mount?
    // probably impossible as route.userContext is needed from props
    // TODO use decorator to register reducer?
    const { storesRegistry } = this.props.route.userContext
    storesRegistry.addReducers({ todos: todosReducer })
  }

  render () {
    const self = this
    return (
      <Connector select={select}>
        {({ todos, dispatch }) =>
          <div>
            <h2>Landing</h2>
            <ul>
              {todos.todoList.map(
                function (todo) {
                  return (
                    <TodoItem
                      key={todo.id}
                      text={todo.text}
                      onClickHandler={
                        self.removeTodo.bind(self, todo.id, dispatch)
                      }
                    />
                  )
                }
              )}
            </ul>
            <button onClick={this.addTodo.bind(this, dispatch)}>
              add todo
            </button>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        }
      </Connector>
    )
  }

  addTodo (dispatch) {
    const name = prompt('name?') // eslint-disable-line
    dispatch(addTodo(name))
  }

  removeTodo (todoId, dispatch) {
    dispatch(removeTodo(todoId))
  }

  renderTodo (todo) {
    return <li>{todo.text}</li>
  }
}

class TodoItem extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onClickHandler: PropTypes.func.isRequired
  }
  render () {
    return (
      <li>
        {this.props.text}
        <button onClick={this.props.onClickHandler}>remove</button>
      </li>
    )
  }
}
