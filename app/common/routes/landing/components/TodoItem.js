import React, { PropTypes, Component } from 'react'

export default class TodoItem extends Component {

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
