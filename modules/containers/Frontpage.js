const React = require('react')
const styles = require('./Frontpage.css')
const Layout = require('../components/Layout.js')
const Entry = require('../components/Frontpage/Entry.js')
const { connect } = require('react-redux')

const entries = [
  { id: 0, commentCount: 0, upvotes: 12, title: 'Hello World', submittedAt: new Date(2015, 10, 11) },
  { id: 1, commentCount: 2, upvotes: 10, title: 'Hello Other World', submittedAt: new Date(2015, 10, 10) },
  { id: 2, commentCount: 0, upvotes: 8, title: 'Hello Other World', submittedAt: new Date(2015, 10, 1) },
]

const Frontpage = React.createClass({
  propTypes: {
    isAuthenticated: React.PropTypes.bool.isRequired,
    me: React.PropTypes.object.isRequired,
  },
  statics: {
    graphQuery(state) {
      if (state.auth.isAuthenticated) {
        return `{
          me { id, emailAddress },
        }`
      }
    },
  },
  render() {
    const entriesLength = entries.length
    return (
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.innerHeader}>
            {this.props.isAuthenticated ? (<span>Signed in as <i>{this.props.me.emailAddress}</i>.</span>) : ''} View: <b>Top</b>.
          </div>
        </div>
        <div className={styles.entries}>
          {entries.map((entry, index) => (
            <Entry
              key={entry.id}
              isFirstItem={index === 0}
              isLastItem={index === entriesLength - 1}
              commentCount={entry.commentCount}
              upvotes={entry.upvotes}
              title={entry.title}
              submittedAt={entry.submittedAt}
            />
          ))}
        </div>
      </div>
    )
  },
})

if (SERVER) {
  Frontpage.styles = [styles.source, ...Layout.styles, ...Entry.styles]
}

const mapStateToProps = state => {
  const { userId, isAuthenticated } = state.auth
  return {
    isAuthenticated,
    me: isAuthenticated ? state.users[userId] : {},
  }
}
module.exports = connect(mapStateToProps)(Frontpage)
