export = tspl;
declare function tspl(t: TestContext, opts?: Options): TSPLTestContext;
declare namespace tspl {
    export { tspl as default, tspl, Options, TestContext, Assert, TSPLTestContext, Plan };
}
type Options = {
    plan?: number;
    done?: (err?: Error) => void;
};
type TestContext = import("node:test").TestContext;
type Assert = typeof assert;
type TSPLTestContext = TestContext & Omit<Assert, "AssertionError" | "CallTracker" | "strict"> & {
    end: () => void;
    completed: Promise<void>;
};
type Plan = TSPLTestContext;
import assert = require("assert");
