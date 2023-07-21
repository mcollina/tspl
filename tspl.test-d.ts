import test from 'node:test';
import { expectType } from 'tsd';
import { tspl, Plan } from './tspl';

test('tspl', (t) => {
  expectType<Plan>(tspl(t, { plan: 1 }));
  const p: Plan = tspl(t, { plan: 1 });

  p.strictEqual(1, 1);

  expectType<void>(p.end());
});

test('complete', async (t) => {
  expectType<Plan>(tspl(t, { plan: 1 }));
  const p: Plan = tspl(t, { plan: 1 });

  setTimeout(() => {
    p.strictEqual(1, 1);
  });

  await p.complete
});

test('tspl', (t) => {
  const p: Plan = tspl(t);

  p.strictEqual(1, 1);

  expectType<void>(p.end());
});
