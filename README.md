# tspl

Test Planner for [`node:test`](https://nodejs.org/api/test.html)
and [`node:assert`](https://nodejs.org/api/assert.html).
It fails your tests if the number of assertions is not met,
or the test plan was not completed.

> [!TIP]
> Since [Node 20.15.0](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V20.md#20.15.0) /
> [Node 22.2.0](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V22.md#22.2.0)
> this functionality is baked into `node:test` itself (see 
> [`context.plan(count)`](https://nodejs.org/api/test.html#contextplancountoptions)).
> If you only use those versions or later, then you do not
> need this module.

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

The options are:

* `plan`: The number of assertions that are expected to run.
* `wait`: If `true`, the plan waits indefinitely for all assertions and subtests to run.
  If `false`, the plan performs an immediate check after the test function completes, without waiting for any pending assertions or subtests. Any assertions or subtests that complete after this check will not be counted towards the plan.
  If a `number`, it specifies the maximum wait time in milliseconds before timing out while waiting for expected assertions and subtests to be matched. If the timeout is reached, the test will fail. **Default**: `false`.
* `done`: an optional callback that will be called when the plan is completed.

### `Plan`

The plan includes all exports from [`node:assert`](https://nodejs.org/api/assert.html),
as well as:

* `end()`: a function to complete the plan
* `completed`: a promise that will resolve when the plan is completed.

### `t.plan(count, options?)`

You can also override the plan by calling `t.plan(count, options)`.

If you call `t.plan()` after creating a plan with `tspl()`, the options passed to `t.plan()` will override those passed to `tspl()`.


The options are:

* `count`: The number of assertions that are expected to run.
* `wait`: If `true`, the plan waits indefinitely for all assertions and subtests to run.
  If `false`, the plan performs an immediate check after the test function completes, without waiting for any pending assertions or subtests. Any assertions or subtests that complete after this check will not be counted towards the plan.
  If a `number`, it specifies the maximum wait time in milliseconds before timing out while waiting for expected assertions and subtests to be matched. If the timeout is reached, the test will fail. **Default**: `false`.

### `t.assert`

An object containing assertion methods bound to `context`. The top-level functions from the `node:assert` module are exposed here for the purpose of creating test plans.

## License

MIT
