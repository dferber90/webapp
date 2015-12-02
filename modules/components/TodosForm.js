const React = require('react')
const ReactDOM = require('react-dom')

const TodosForm = React.createClass({
  propTypes: {
    handleSubmit: React.PropTypes.func,
  },
  getInitialState() {
    return { value: '' }
  },
  handleChange(event) {
    this.setState({ value: event.target.value })
  },
  handleSubmit(event) {
    event.preventDefault()
    const value = this.state.value.trim()
    if (value.length > 0) {
      this.props.handleSubmit(this.state.value)
    }
    this.setState({ value: '' })
    ReactDOM.findDOMNode(this.refs.todoName).focus()
  },
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref="todoName" value={this.state.value} onChange={this.handleChange}/>
        <input type="submit" value="add todo"/>
      </form>
    )
  },
})

module.exports = TodosForm
