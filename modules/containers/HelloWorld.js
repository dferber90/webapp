const React = require('react')
const moment = require('moment')
const mario = require('../images/mario.png')
const cssStyles = require('./HelloWorld.css')

const HelloWorld = React.createClass({
  render() {
    return (
      <div>
        <h1 className={cssStyles.heading}>Hello world :-)</h1>
        <img src={mario} width="150"/>
        <p>It is {moment().format('dddd')}.</p>
      </div>
    )
  },
})

module.exports = HelloWorld
