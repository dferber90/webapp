const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')
const TodosList = require('../components/TodosList')
const TodosForm = require('../components/TodosForm')
const todoActionCreators = require('../action-creators/todos')
const reduceWithDefault = require('../utils/reduceWithDefault')
const todosReducer = require('../reducers/todos')
// const { checkHttpStatus, parseJSON } = require('../utils/fetch-utils')
const { setTodos } = require('../action-creators/todos')

const Dashboard = React.createClass({
  propTypes: {
    addTodo: React.PropTypes.func,
    todos: React.PropTypes.array,
  },
  statics: {
    reducer: reduceWithDefault(
      (state, action) => ({ ...state, todos: todosReducer(state.todos, action) })
    ),
    fetchData({ dispatch }) {
      // Relay-Like approach
      // return {
      //   type: 'DATA_REQUEST'
      //   query: `
      //     shows(id: 5) {
      //       title,
      //       description,
      //       coverImage {
      //         url,
      //         width,
      //         height
      //       }
      //     }
      //   `,
      //   cacheDuration: 'session', // refetch on every new request? how long to cache?
      //   liveUpdates: true, // toggles subscription to data, when false liveUpdates will be ignored (good for paginated stuff)
      //                      // AUTO-unsubscribe when HoC is destroyed
      //   onData: (response, isOptimistic, isLiveUpdate) => dispatch(setTodos(response.data.todos)), // when data or live-data from sub arrives
      //   onError: (error) => dispatch({ type: 'NO_CONNECTION', error }))
      // }
      //
      // Mutations / Writes:
      // E.g. in a handleSubmit of a component
      // return {
      //   type: 'DATA_MUTATION',
      //   query: `
      //     XY
      //   `,
      //   optimistic: true|false // should cause optimistic updates (not sure whether to specify it here as well),
      //   ...
      // }

      // return adapter
      //   .execute('{ todos { text, _id } }')
      //   .then(response => {
      //     dispatch(setTodos(response.data.todos))
      //   })
      //   .catch((error) => dispatch({ type: 'NO_CONNECTION', error }))

      // TODO use action creator
      // graphql({ query: ``, variables: {}, onSuccess: fn, onError: fn })
      return dispatch({
        type: 'GRAPHQL',
        payload: {
          query: '{ todos { text, _id } }',
          variables: {},
        },
        meta: {
          onSuccess: (response) => setTodos(response.data.todos),
          onError: (error) => ({ type: 'NO_CONNECTION', error }),
        },
      })
    },
  },
  handleSubmit(text) {
    this.props.addTodo(text)
  },
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>This is going to be awesome.</p>
        <TodosList items={this.props.todos.map(todoItem => todoItem.text)}/>
        <TodosForm handleSubmit={this.handleSubmit} />
      </div>
    )
  },
})

const mapStateToProps = state => ({ todos: state.todos })
// binds addTodo to dispatch and adds it to props
const mapDispatchToProps = dispatch => bindActionCreators(todoActionCreators, dispatch)
module.exports = connect(mapStateToProps, mapDispatchToProps)(Dashboard)
