'use strict'

const assert = require('node:assert')

/**
 * @typedef {Object} Options
 * @property {number} [plan] - number of expected assertions
 * @property {(err?: Error) => void} [done] - callback when the plan is completed
 */

/** @typedef {import('node:test').TestContext} TestContext */
/** @typedef {Omit<import('node:assert'), 'AssertionError' | 'CallTracker' | 'strict'>} AssertFns */

/**
 * @typedef {object} TSPLContext
 * @property {(err?: Error) => void} end - end the test and check the plan
 * @property {Promise<void>} completed - promise that resolves when the plan is completed
 */

/** @typedef {TestContext & AssertFns & TSPLContext & PromiseLike<void>} TSPLTestContext */

/** @typedef {TSPLTestContext} Plan */

/**
 *
 * @param {TestContext} t
 * @param {Options} [opts={}]
 * @returns {TSPLTestContext}
 */
function tspl (t, opts = {}) {
  if (t) {
    t.after(autoEnd)
  }

  let ended = false
  let {
    plan,
    done
  } = opts
  let actual = 0

  t.plan = function (n) {
    plan = n
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

    if (plan) {
      assert.strictEqual(actual, plan, t.name ? `The plan for '${t.name}' was not completed` : 'The plan was not completed')
    } else {
      assert.fail(t.name ? `The plan for '${t.name}' was not completed` : 'The plan was not completed')
    }
  }

  function end () {
    if (ended) {
      return
    }
    ended = true

    if (plan) {
      try {
        assert.strictEqual(actual, plan, t.name ? `The plan for '${t.name}' was not completed` : 'The plan was not completed')
        _resolve()
        done && done()
      } catch (err) {
        _resolve()
        if (done) {
          done(err)
        } else {
          throw err
        }
      }
    } else {
      done && done()
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

        if (actual === plan) {
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
