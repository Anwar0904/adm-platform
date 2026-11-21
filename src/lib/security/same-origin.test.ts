import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/api-error";
import { enforceSameOrigin } from "./same-origin";

test("same-origin guard rejects cross-site cookie mutations", () => {
  const request = new NextRequest("https://app.example.test/api/auth/change-password", {
    method: "POST",
    headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" },
  });

  assert.throws(
    () => enforceSameOrigin(request),
    (error: unknown) => error instanceof ApiError && error.statusCode === 403,
  );
});

test("same-origin guard requires Origin on login-style requests", () => {
  const request = new NextRequest("https://app.example.test/api/auth/login", { method: "POST" });

  assert.throws(
    () => enforceSameOrigin(request, { requireOrigin: true }),
    (error: unknown) => error instanceof ApiError && error.statusCode === 403,
  );
});

test("same-origin guard permits safe methods and explicit Bearer clients", () => {
  const safeRequest = new NextRequest("https://app.example.test/api/users", { method: "GET" });
  const bearerRequest = new NextRequest("https://app.example.test/api/users", {
    method: "POST",
    headers: { authorization: "Bearer explicit-client-token" },
  });

  assert.doesNotThrow(() => enforceSameOrigin(safeRequest, { requireOrigin: true }));
  assert.doesNotThrow(() => enforceSameOrigin(bearerRequest, { requireOrigin: true }));
});
