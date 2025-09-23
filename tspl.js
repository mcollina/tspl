'use strict'

const assert = require('node:assert')

/**
 * @typedef {object} TSPLContext
 * @property {(err?: Error) => void} end - end the test and check the plan
 * @property {Promise<void>} completed - promise that resolves when the plan is completed
 */

/**
 * @typedef {object} Options
 * @property {number} [plan] - number of expected assertions
 * @property {boolean|number} [wait=false] - wait time in milliseconds before automatically ending the test
 * @property {(err?: Error) => void} [done] - callback when the plan is completed
 */

/** @typedef {import('node:test').TestContext} TestContext */
/** @typedef {Omit<import('node:assert'), 'AssertionError' | 'CallTracker' | 'strict'>} AssertFns */
/** @typedef {TestContext & AssertFns & TSPLContext & PromiseLike<void>} TSPLTestContext */
/** @typedef {TSPLTestContext} Plan */

/**
 * @param {TestContext} t
 * @param {Options} [opts={}]
 * @returns {TSPLTestContext}
 */
function tspl (t, opts = {}) {
  if (t) {
    t.after(autoEnd)
  }

  let ended = false

  opts.plan = opts.plan || 0
  opts.done = opts.done || undefined
  opts.wait = opts.wait ?? false

  let actual = 0

  t.plan = function (n, options = {}) {
    opts.plan = n
    if (options.wait) {
      opts.wait = options.wait
    }
    return t
  }

  let _resolve
  const completed = new Promise((resolve) => {
    _resolve = resolve
  })

  async function autoEnd () {
    if (ended) {
      return
    }

    if (opts.wait === true) {
      return completed
    } else if (typeof opts.wait === 'number' && opts.wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, /** @type {number} */ (opts.wait)))
    }

    if (opts.plan) {
      assert.strictEqual(actual, opts.plan, t.name ? `The plan for '${t.name}' was not completed` : 'The plan was not completed')
    } else {
      assert.fail(t.name ? `The plan for '${t.name}' was not completed` : 'The plan was not completed')
    }
  }

  function end () {
    if (ended) {
      return
    }
    ended = true

    if (opts.plan) {
      try {
        assert.strictEqual(actual, opts.plan, t.name ? `The plan for '${t.name}' was not completed` : 'The plan was not completed')
        _resolve()
        opts.done && opts.done()
      } catch (err) {
        _resolve()
        if (opts.done) {
          opts.done(err)
        } else {
          throw err
        }
      }
    } else {
      opts.done && opts.done()
      _resolve()
    }
  }

  Object.defineProperties(t, {
    then: {
      get () {
        return completed.then.bind(completed)
      }
    },
    end: {
      get () {
        return end
      }
    },
    completed: {
      get () {
        return completed
      }
    }
  })

  const assertTestContext = {}

  for (const method of Object.keys(assert)) {
    if (/^[a-z]/.test(method) && typeof assert[method] === 'function' && method !== 'strict') {
      const fn = (...args) => {
        actual++
        const result = assert[method](...args)

        if (actual === opts.plan) {
          _resolve()
        }

        return result
      }
      assertTestContext[method] = fn
    }
  }

  Object.assign(t, assertTestContext)

  Object.defineProperty(t, 'assert', {
    get () {
      return assertTestContext
    }
  })

  return /** @type {TSPLTestContext} */ (/** @type {*} */(t))
}

module.exports = tspl
module.exports.default = tspl
module.exports.tspl = tspl
