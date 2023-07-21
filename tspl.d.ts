import test from 'node:test'
import assert from 'node:assert'

type TestFn = Exclude<Parameters<typeof test.test>[0], undefined>
type TextContext = Exclude<Parameters<TestFn>[0], undefined>;

export interface Options {
  plan?: number;
}

export type Plan = Omit<typeof assert, 'CallTracker' | 'AssertionError' | 'strict'> & {
  complete: Promise<void>
  end: () => void
}

export declare function tspl (context: TextContext, opts?: Options): Plan;

export default tspl;
