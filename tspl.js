'use strict'

const assert = require('node:assert')

function tspl (t, opts = {}) {
  if (t) {
    t.after(autoEnd)
  }

  let ended = false
  const { plan } = opts
  let actual = 0

  let _resolve
  const completed = new Promise((resolve) => {
    _resolve = resolve
  })

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

  function end () {
    if (ended) {
      return
    }
    ended = true

    if (plan) {
      assert.strictEqual(actual, plan, 'The plan was not completed')
      _resolve()
    }
  }

  const res = {
    completed,
    end
  }

  Object.defineProperty(res, 'then', {
    get () {
      return completed.then.bind(completed)
    }
  })

  for (const method of Object.keys(assert)) {
    if (method.match(/^[a-z]/)) {
      res[method] = (...args) => {
        actual++
        const res = assert[method](...args)

        if (actual === plan) {
          _resolve()
        }

        return res
      }
    }
  }

  return res
}

module.exports = tspl
module.exports.default = tspl
module.exports.tspl = tspl
