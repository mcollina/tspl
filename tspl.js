'use strict'

const assert = require('node:assert')

function tspl (t, opts = {}) {
  if (t) {
    t.after(autoEnd)
  }

  let ended = false
  const { plan: expectedPlan } = opts
  let actual = 0

  let _resolve
  const plan = new Promise((resolve) => {
    _resolve = resolve
  })

  async function autoEnd () {
    if (ended) {
      return
    }

    if (expectedPlan) {
      assert.strictEqual(actual, expectedPlan, 'The plan was not completed')
    } else {
      assert.fail('The plan was not completed')
    }
  }

  function end () {
    if (ended) {
      return
    }
    ended = true

    if (expectedPlan) {
      assert.strictEqual(actual, expectedPlan, 'The plan was not completed')
      _resolve()
    }
  }

  for (const method of Object.keys(assert)) {
    if (method.match(/^[a-z]/)) {
      plan[method] = (...args) => {
        actual++
        const res = assert[method](...args)

        if (actual === expectedPlan) {
          _resolve()
        }

        return res
      }
    }
  }

  plan.end = end
  plan.completed = plan
  return plan
}

module.exports = tspl
module.exports.default = tspl
module.exports.tspl = tspl
