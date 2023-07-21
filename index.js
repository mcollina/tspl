'use strict'

const assert = require('node:assert')

function tspl (t, opts = {}) {
  if (t) {
    t.after(autoEnd)
  }

  let ended = false
  const { plan } = opts
  let actual = 0

  async function autoEnd () {
    if (ended) {
      return
    }

    if (plan) {
      assert.strictEqual(actual, plan, 'The plan was not completed')
    } else {
      assert.fail('The plan was not completed')
    }
  }

  async function end () {
    if (ended) {
      return
    }
    ended = true

    if (plan) {
      assert.strictEqual(actual, plan, 'The plan was not completed')
    }
  }

  const res = {
    end
  }

  for (const method of Object.keys(assert)) {
    if (method.match(/^[a-z]/)) {
      res[method] = (...args) => {
        actual++
        return assert[method](...args)
      }
    }
  }

  return res
}

module.exports = tspl
