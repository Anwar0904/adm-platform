import assert from "node:assert/strict";
import test from "node:test";
import { isRoleSeedRouteDisabled } from "./seed-route-policy";

test("role seeding endpoint is disabled in production", () => {
  assert.equal(isRoleSeedRouteDisabled("production"), true);
});

test("role seeding remains available for its authenticated nonproduction path", () => {
  assert.equal(isRoleSeedRouteDisabled("development"), false);
  assert.equal(isRoleSeedRouteDisabled("test"), false);
});
