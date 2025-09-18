// @ts-check
'use strict'

const assert = require('node:assert')

function tspl (t, opts) {
  if (t && t.plan) {
    return _tsplTestWrapper(t, opts)
  }
  return _tsplOrig(t, opts)
}

function _tsplTestWrapper (t, opts = {}) {
  const { plan } = opts

  if (plan) {
    t.plan(plan)
  }

  let actual = 0

  let _resolve
  const completed = new Promise((resolve) => {
    _resolve = resolve
  })

  function end () {
    try {
      if (plan) {
        assert.strictEqual(actual, plan, 'The plan was not completed')
      }
    } finally {
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

  for (const method of Object.keys(t.assert)) {
    if (method.match(/^[a-z]/)) {
      res[method] = (...args) => {
        actual++
        const result = t.assert[method](...args)

        if (actual === plan) {
          process.nextTick(() => _resolve())
        }

        return result
      }
    }
  }

  return res
}

/**
 *
 * @param {import('node:test').TestContext} t
 * @param {*} opts
 * @returns
 */
function _tsplOrig (t, opts = {}) {
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

    try {
      if (plan) {
        assert.strictEqual(actual, plan, 'The plan was not completed')
      } else {
        assert.fail('The plan was not completed')
      }
    } finally {
      ended = true
      _resolve()
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
