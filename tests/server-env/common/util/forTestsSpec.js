import test from 'tape'
import forTests from '../../../../app/common/util/forTests.js'

test('A passing test on server', (assert) => {
  assert.equal(forTests(), 'server')

  assert.end()
})
