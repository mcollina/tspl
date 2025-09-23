'use strict'

const test = require('node:test')
const assert = require('node:assert')
const tspl = require('.')

test('simple test plan', async (t) => {
  const { strictEqual, end } = tspl(t)
  strictEqual(1, 1)
  end()
})

test('simple test plan with passing with providing done to tspl', (t, done) => {
  const { strictEqual, end } = tspl(t, { done })
  strictEqual(1, 1)
  end()
})

test('simple test plan failing and providing done to tspl', () => {
  const { strictEqual, end } = tspl({
    after: () => {},
    strictEqual: assert.strictEqual
  }, { plan: 2 })
  strictEqual(1, 1)

  assert.throws(() => end(), new assert.AssertionError({
    message: 'The plan was not completed',
    operator: 'strictEqual',
    actual: 1,
    expected: 2
  }))
})

test('simple test plan failing with not providing done to tspl', () => {
  const { strictEqual, end } = tspl({
    after: () => {},
    strictEqual: assert.strictEqual
  }, { plan: 2 })
  strictEqual(1, 1)

  assert.throws(() => end(), new assert.AssertionError({
    message: 'The plan was not completed',
    operator: 'strictEqual',
    actual: 1,
    expected: 2
  }))
})

test('simple test plan failing with providing done to tspl', () => {
  const testDone = (err) => {
    assert.deepStrictEqual(err, new assert.AssertionError({
      message: 'The plan was not completed',
      operator: 'strictEqual',
      actual: 1,
      expected: 2
    }))
  }
  const { strictEqual, end } = tspl({
    after: () => {},
    strictEqual: assert.strictEqual
  }, { plan: 2, done: testDone })
  strictEqual(1, 1)

  end()
})

test('simple test plan failing', async (t) => {
  let _fn
  tspl({
    after (fn) {
      _fn = fn
    }
  })
  await assert.rejects(_fn, new assert.AssertionError({
    message: 'The plan was not completed',
    operator: 'fail'
  }))
})

test('simple test plan with counter', async (t) => {
  const { strictEqual, end } = tspl(t, { plan: 2 })
  strictEqual(1, 1)
  strictEqual(1, 1)
  end()
})

test('simple test plan with counter failing', async (t) => {
  const { end } = tspl(t, { plan: 2 })
  assert.throws(end, new assert.AssertionError({
    message: 'The plan for \'simple test plan with counter failing\' was not completed',
    operator: 'strictEqual',
    expected: 2,
    actual: 0
  }))
})

test('counter failing in after', async (t) => {
  let _fn
  tspl({
    after (fn) {
      _fn = fn
    }
  }, {
    plan: 2
  })
  await assert.rejects(_fn, new assert.AssertionError({
    message: 'The plan was not completed',
    operator: 'strictEqual',
    expected: 2,
    actual: 0
  }))
})

test('counter completed in after', async (t) => {
  let _fn
  const { strictEqual } = tspl({
    after (fn) {
      _fn = fn
    }
  }, {
    plan: 2
  })

  strictEqual(1, 1)
  strictEqual(1, 1)

  // no errors
  await _fn()
})

test('wait', async (t) => {
  const { strictEqual, completed } = tspl(t, { plan: 1 })

  setImmediate(() => {
    strictEqual(1, 1)
  })

  await completed
})

test('await plan', async (t) => {
  const plan = tspl(t, { plan: 1 })

  setImmediate(() => {
    plan.strictEqual(1, 1)
  })

  await plan
})

test('t.assert is the same as assert', async (t) => {
  t = tspl(t, { plan: 1 })
  t.assert.strictEqual(1, 1)
})

test('use t.assert and await plan', async (t) => {
  const plan = tspl(t, { plan: 1 })

  setImmediate(() => {
    plan.assert.strictEqual(1, 1)
  })

  await plan
})

test('it is possible to override the configure plan by calling .plan()', async (t) => {
  t = tspl(t, { plan: 2 })

  t.plan(1)

  t.assert.strictEqual(1, 1)

  await t.completed
})
