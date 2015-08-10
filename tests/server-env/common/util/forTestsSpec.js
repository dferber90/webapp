import test from 'tape'
import forTests from 'common/util/forTests.js'

test('A passing test on server', (assert) => {
  assert.equal(forTests(), 'server')

  assert.end()
})
