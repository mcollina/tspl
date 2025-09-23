export = tspl;
declare function tspl(t: TestContext, opts?: Options): TSPLTestContext;
declare namespace tspl {
    export { tspl as default, tspl, TSPLContext, Options, TestContext, AssertFns, TSPLTestContext, Plan };
}
type TSPLContext = {
    end: (err?: Error) => void;
    completed: Promise<void>;
};
type Options = {
    plan?: number;
    wait?: boolean | number;
    done?: (err?: Error) => void;
};
type TestContext = import("node:test").TestContext;
type AssertFns = Omit<typeof assert, "AssertionError" | "CallTracker" | "strict">;
type TSPLTestContext = TestContext & AssertFns & TSPLContext & PromiseLike<void>;
type Plan = TSPLTestContext;
import assert = require("assert");
