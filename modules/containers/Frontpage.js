const React = require('react')
const styles = require('./Frontpage.css')
const Layout = require('../components/Layout.js')
const Entry = require('../components/Frontpage/Entry.js')

const entries = [
  { id: 0, commentCount: 0, upvotes: 12, title: 'Hello World', submittedAt: new Date() },
  { id: 1, commentCount: 2, upvotes: 10, title: 'Hello Other World', submittedAt: new Date() },
  { id: 2, commentCount: 0, upvotes: 8, title: 'Hello Other World', submittedAt: new Date() },
]

const Frontpage = React.createClass({
  render() {
    const entriesLength = entries.length
    return (
      <Layout>
        <div className={styles.header}>
          <div className={styles.innerHeader}>
            View: <b>Top</b>.
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
      </Layout>
    )
  },
})

if (SERVER) {
  Frontpage.styles = [styles.source, ...Layout.styles, ...Entry.styles]
}

module.exports = Frontpage
