import assert from "node:assert/strict";
import test from "node:test";
import { publicProofVisibility } from "./public-proof-visibility";

test("unverified public proof groups remain hidden by default", () => {
  assert.deepEqual(Object.values(publicProofVisibility), [false, false, false, false, false, false]);
});
