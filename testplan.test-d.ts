import test from 'node:test';
import { expectType } from 'tsd';
import { testplan, Plan } from './testplan';

test('testplan', (t) => {
  expectType<Plan>(testplan(t, { plan: 1 }));
  const p: Plan = testplan(t, { plan: 1 });

  p.strictEqual(1, 1);

  expectType<void>(p.end());
});

test('complete', async (t) => {
  expectType<Plan>(testplan(t, { plan: 1 }));
  const p: Plan = testplan(t, { plan: 1 });

  setTimeout(() => {
    p.strictEqual(1, 1);
  });

  await p.complete
});

test('testplan', (t) => {
  const p: Plan = testplan(t);

  p.strictEqual(1, 1);

  expectType<void>(p.end());
});
