import test from 'tape'
import forTest from 'common/util/forTests.js'

test('A passing test', (assert) => {
  assert.equal(forTest(), 'client')

  assert.end()
})
