module.exports = () => ({
  path: '{{path}}',
  getComponent(location, cb) {
    require.ensure(
      [],
      (require) => cb(null, require(/* TODO FILL ME IN */))
    )
  },
})
