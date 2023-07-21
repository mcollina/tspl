'use strict'

const test = require('node:test')
const assert = require('node:assert')
const testplan = require('.')

test('simple test plan', async (t) => {
  const { strictEqual, end } = testplan(t)
  strictEqual(1, 1)
  end()
})

test('simple test plan failing', async (t) => {
  let _fn
  testplan({
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
  const { strictEqual, end } = testplan(t, { plan: 2 })
  strictEqual(1, 1)
  strictEqual(1, 1)
  end()
})

test('simple test plan with counter failing', async (t) => {
  const { end } = testplan(t, { plan: 2 })
  assert.throws(end, new assert.AssertionError({
    message: 'The plan was not completed',
    operator: 'strictEqual',
    expected: 2,
    actual: 0
  }))
})

test('counter failing in after', async (t) => {
  let _fn
  testplan({
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
  const { strictEqual } = testplan({
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
  const { strictEqual, completed } = testplan(t, { plan: 1 })

  setImmediate(() => {
    strictEqual(1, 1)
  })

  await completed
})
