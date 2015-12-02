const Adapter = require('../api-client/adapter')
const adapter = new Adapter({ endpoint: 'http://localhost:3001/graphql/v1' })

module.exports = {
  addTodo: function addTodo(text) {
    return adapter.execute(
      `mutation newTodo($text: String!) { addTodo(text: $text) { _id, text } }`,
      { text: text }
    ).then(response => {
      return {
        type: 'ADD_TODO',
        payload: response.data.addTodo,
      }
    })
  },
  setTodos: function setTodos(todos) {
    return {
      type: 'SET_TODOS',
      payload: todos,
    }
  },
}
