import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { isAuthRequestRateLimited, resetAuthRequestLimitsForTests } from "./auth-request-limit";

test("auth request limiter caps repeated account requests inside a window", () => {
  resetAuthRequestLimitsForTests();
  const request = new NextRequest("https://app.example.test/api/auth/forgot-password", { method: "POST" });
  const options = { identifierLimit: 2, ipLimit: 10, windowMs: 60_000 };

  assert.equal(isAuthRequestRateLimited(request, "password-reset", "person@example.test", options, 1_000), false);
  assert.equal(isAuthRequestRateLimited(request, "password-reset", "person@example.test", options, 2_000), false);
  assert.equal(isAuthRequestRateLimited(request, "password-reset", "person@example.test", options, 3_000), true);
  assert.equal(isAuthRequestRateLimited(request, "password-reset", "other@example.test", options, 3_000), false);
  resetAuthRequestLimitsForTests();
});

test("auth request limiter resets an account bucket after the window", () => {
  resetAuthRequestLimitsForTests();
  const request = new NextRequest("https://app.example.test/api/auth/login", { method: "POST" });
  const options = { identifierLimit: 1, ipLimit: 10, windowMs: 60_000 };

  assert.equal(isAuthRequestRateLimited(request, "login", "person@example.test", options, 1_000), false);
  assert.equal(isAuthRequestRateLimited(request, "login", "person@example.test", options, 61_001), false);
  resetAuthRequestLimitsForTests();
});
