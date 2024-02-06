# tspl

Test Planner for [`node:test`](https://nodejs.org/api/test.html)
and [`node:assert`](https://nodejs.org/api/assert.html).
It fails your tests if the number of assertions is not met,
or the test plan was not completed.

## Installation

```bash
npm i @matteo.collina/tspl --save-dev
```

(You'll also need `@types/node`)

## Example

```js
import test from 'node:test';
import { tspl } from '@matteo.collina/tspl';

test('tspl', (t) => {
  const { strictEqual } = tspl(t, { plan: 1 });
  strictEqual(1, 1);
});
```

### Typescript

```typescript
import test from 'node:test';
import { tspl, type Plan } from '@matteo.collina/tspl';

test('tspl', (t) => {
  const p: Plan = tspl(t, { plan: 1 });
  p.strictEqual(1, 1);
});
```

## API

### __`tspl(t: TestContext, options): Plan`__

Create a plan for the current test.

Here are the options:

* `plan`: how many assertions are planned

### `Plan`

The plan includes all exports from [`node:assert`](https://nodejs.org/api/assert.html),
as well as:

* `end()`: a function to complete the plan
* `completed`: a promise that will resolve when the plan is completed.

## License

MIT
