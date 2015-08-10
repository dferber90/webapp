import test from 'tape'
import forTests from 'common/util/forTests.js'

test('A passing test on client', (assert) => {
  assert.equal(forTests(), 'client')

  assert.end()
})

test('A second passing test on client', (assert) => {
  assert.equal(forTests(), 'client')

  assert.end()
})
