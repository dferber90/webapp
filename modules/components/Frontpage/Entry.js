const React = require('react')
const { Link } = require('react-router')
const styles = require('./Entry.css')
const moment = require('moment')

const Entry = ({
  isFirstItem,
  isLastItem,
  title,
  commentCount,
  upvotes,
  submittedAt,
}) => {
  const topClass = isFirstItem ? styles.roundedTop : ''
  const bottomClass = isLastItem ? styles.roundedBottom : ''
  return (
    <div className={styles.entry + ' ' + topClass + ' ' + bottomClass}>
      <div className={styles.up}>
        <button className={styles.upIcon}>
          up ({upvotes})
        </button>
      </div>
      <div className={styles.info}>
        <p>{title}</p>
        {moment(submittedAt).fromNow()}
      </div>
      <div className={styles.comment}>
        <Link to="/" className={styles.commentIcon}>
          c ({commentCount})
        </Link>
      </div>
</div>
  )
}

if (SERVER) {
  Entry.styles = [styles.source]
}

module.exports = Entry
