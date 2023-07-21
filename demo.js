const test = require('node:test')
const tspl = require('.')

test('tspl', async (t) => {
  const { strictEqual } = tspl(t, { plan: 2 })
  strictEqual(1, 1)
})
