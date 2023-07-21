# testplan

Test Planner for [`node:test`](https://nodejs.org/api/test.html)
and [`node:assert`](https://nodejs.org/api/assert.html).
It fails your tests if the number of assertions is not met,
or the test plan was not completed.

## Install

```bash
npm i testplan
```

(You'll also need `@types/node`)

## Example

```js
import test from 'node:test'
import testplan from 'testplan'

test('tspl', (t) => {
  const { strictEqual } = testplan(t, { plan: 1 })
  p.strictEqual(1, 1)
})
```

### Typescript

```typescript
import test from 'node:test';
import { testplan, Plan } from 'testplan';

test('tspl', (t) => {
  const p: Plan = tspl(t, { plan: 1 });
  p.strictEqual(1, 1);
});
```

## API

### __`testplan(t: TestContext, options): Plan`__

Create a plan for the current test.

Here are the options:

* `plan`: how many assertions are planned

### `Plan`

The plan includes all exports from [`node:assert`](https://nodejs.org/api/assert.html),
as well as:

* `end()`: a function to complete the plan
* `complete`: a promise that will resolve when the plan is completed.

## License

MIT
