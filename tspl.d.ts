export = tspl;
declare function tspl(t: TestContext, opts?: Options): TSPLTestContext;
declare namespace tspl {
    export { tspl as default, tspl, Options, TestContext, Assert, TSPLContext, TSPLTestContext, Plan };
}
type Options = {
    plan?: number;
    done?: (err?: Error) => void;
};
type TestContext = import("node:test").TestContext;
type Assert = Omit<typeof assert, "AssertionError" | "CallTracker" | "strict">;
type TSPLContext = {
    end: (err?: Error) => void;
    completed: Promise<void>;
};
type TSPLTestContext = TestContext & Assert & TSPLContext & PromiseLike<void>;
type Plan = TSPLTestContext;
import assert = require("assert");
