const React = require('react')
const moment = require('moment')
const styles = require('./Frontpage.css')
const Layout = require('../components/Layout.js')

const Frontpage = React.createClass({
  render() {
    const text = `It is ${moment().format('dddd')}.`
    return (
      <Layout>
        <div className={styles.page}>
          <p>{text}</p>
        </div>
      </Layout>
    )
  },
})

if (SERVER) {
  Frontpage.styles = [styles.source, ...Layout.styles]
}

module.exports = Frontpage
