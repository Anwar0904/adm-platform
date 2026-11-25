import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/api-error";
import { authFlowRateLimitedResponse } from "@/lib/api/auth-flow-response";
import {
  AUTH_REQUEST_LIMITS,
  AUTH_RATE_LIMIT_TIMEOUT_MS,
  createAuthRateLimitAbortSignal,
  createAuthRequestLimiter,
  createInMemoryAuthRateLimitStore,
  createRedisAuthRateLimitStore,
  isAuthRequestRateLimited,
} from "./auth-request-limit";

const request = (headers?: HeadersInit) => new NextRequest("https://app.example.test/api/auth/login", {
  method: "POST",
  headers,
});

const options = { identifierLimit: 2, ipLimit: 10, windowMs: 60_000 };
const keySecret = "unit-test-key-secret-that-is-not-a-production-credential";

test("allows requests below the account limit and denies excess requests", async () => {
  const limiter = createAuthRequestLimiter({ store: createInMemoryAuthRateLimitStore(), keySecret });

  assert.equal(await limiter(request(), "login", "person@example.test", options, 1_000), false);
  assert.equal(await limiter(request(), "login", "person@example.test", options, 2_000), false);
  assert.equal(await limiter(request(), "login", "person@example.test", options, 3_000), true);
  assert.equal(await limiter(request(), "login", "other@example.test", options, 3_000), false);
});

test("retains the existing per-route account/IP budgets and windows", () => {
  assert.deepEqual(AUTH_REQUEST_LIMITS, {
    login: { identifierLimit: 8, ipLimit: 30, windowMs: 15 * 60_000 },
    register: { identifierLimit: 3, ipLimit: 10, windowMs: 60 * 60_000 },
    passwordReset: { identifierLimit: 3, ipLimit: 15, windowMs: 15 * 60_000 },
    passwordResetCompletion: { identifierLimit: 5, ipLimit: 30, windowMs: 15 * 60_000 },
    emailVerification: { identifierLimit: 3, ipLimit: 15, windowMs: 60 * 60_000 },
  });
});

test("expires each bucket relative to its first accepted request", async () => {
  const limiter = createAuthRequestLimiter({ store: createInMemoryAuthRateLimitStore(), keySecret });
  const singleRequest = { ...options, identifierLimit: 1 };

  assert.equal(await limiter(request(), "login", "person@example.test", singleRequest, 1_000), false);
  assert.equal(await limiter(request(), "login", "person@example.test", singleRequest, 60_999), true);
  assert.equal(await limiter(request(), "login", "person@example.test", singleRequest, 61_000), false);
});

test("atomic in-memory store caps concurrent calls without overspending the allowance", async () => {
  const limiter = createAuthRequestLimiter({ store: createInMemoryAuthRateLimitStore(), keySecret });
  const concurrentOptions = { ...options, identifierLimit: 8 };

  const results = await Promise.all(Array.from({ length: 40 }, (_, index) =>
    limiter(request(), "login", "concurrent@example.test", concurrentOptions, 10_000 + index),
  ));

  assert.equal(results.filter((limited) => !limited).length, 8);
  assert.equal(results.filter(Boolean).length, 32);
});

test("separate application instances share counters when connected to the same backend", async () => {
  const sharedBackend = createInMemoryAuthRateLimitStore();
  const instanceA = createAuthRequestLimiter({ store: sharedBackend, keySecret });
  const instanceB = createAuthRequestLimiter({ store: sharedBackend, keySecret });
  const singleRequest = { ...options, identifierLimit: 1 };

  assert.equal(await instanceA(request(), "password-reset", "shared@example.test", singleRequest, 1_000), false);
  assert.equal(await instanceB(request(), "password-reset", "shared@example.test", singleRequest, 1_001), true);
});

test("action namespaces prevent counters from colliding across auth endpoints", async () => {
  const store = createInMemoryAuthRateLimitStore();
  const limiter = createAuthRequestLimiter({ store, keySecret });
  const singleRequest = { ...options, identifierLimit: 1 };

  assert.equal(await limiter(request(), "login", "same@example.test", singleRequest, 1_000), false);
  assert.equal(await limiter(request(), "password-reset", "same@example.test", singleRequest, 1_001), false);
  assert.equal(await limiter(request(), "login", "same@example.test", singleRequest, 1_002), true);
});

test("uses only the explicitly configured trusted IP header", async () => {
  let observedKeys: string[] = [];
  const store = {
    async consume(counters: Array<{ key: string; limit: number }>) {
      observedKeys = counters.map(({ key }) => key);
      return false;
    },
  };
  const limiter = createAuthRequestLimiter({
    store,
    keySecret,
    trustedIpHeader: "x-vercel-client-ip",
  });

  await limiter(request({ "x-forwarded-for": "203.0.113.55" }), "login", "person@example.test", options, 1_000);
  assert.equal(observedKeys.length, 1);
  assert.equal(observedKeys.some((key) => key.includes("203.0.113.55")), false);

  await limiter(request({
    "x-vercel-client-ip": "203.0.113.10",
    "x-forwarded-for": "203.0.113.55",
  }), "login", "person@example.test", options, 1_001);
  assert.equal(observedKeys.length, 2);
  assert.equal(observedKeys.some((key) => key.includes("203.0.113.10")), false);
  assert.equal(observedKeys.some((key) => key.includes("203.0.113.55")), false);
});

test("fails closed if Production's trusted Vercel IP header is unavailable", async () => {
  const limiter = createAuthRequestLimiter({
    store: createInMemoryAuthRateLimitStore(),
    keySecret,
    trustedIpHeader: "x-forwarded-for",
    requireTrustedIp: true,
  });

  await assert.rejects(
    limiter(request({ "x-real-ip": "203.0.113.7" }), "login", "person@example.test", options),
    (error: unknown) => error instanceof ApiError && error.statusCode === 503,
  );
});

test("HMAC-derived keys do not contain email or IP identifiers", async () => {
  let observedKeys: string[] = [];
  const limiter = createAuthRequestLimiter({
    store: {
      async consume(counters: Array<{ key: string; limit: number }>) {
        observedKeys = counters.map(({ key }) => key);
        return false;
      },
    },
    keySecret,
    trustedIpHeader: "x-forwarded-for",
  });

  await limiter(
    request({ "x-forwarded-for": "2001:db8::2" }),
    "login",
    "Person@Example.test",
    options,
    1_000,
  );

  const joined = observedKeys.join("|");
  assert.match(joined, /login:account:[a-f0-9]{64}/);
  assert.match(joined, /login:ip:[a-f0-9]{64}/);
  assert.equal(joined.includes("Person@Example.test"), false);
  assert.equal(joined.includes("person@example.test"), false);
  assert.equal(joined.includes("2001:db8::2"), false);
});

test("fails closed with a generic 503 when Redis is unavailable", async () => {
  const limiter = createAuthRequestLimiter({
    store: { async consume() { throw new Error("sensitive provider details"); } },
    keySecret,
  });

  await assert.rejects(
    limiter(request(), "login", "person@example.test", options),
    (error: unknown) => error instanceof ApiError &&
      error.statusCode === 503 &&
      error.message === "Authentication is temporarily unavailable." &&
      !error.message.includes("sensitive provider details"),
  );
});

test("production request without Redis configuration cannot use the local limiter", async (context) => {
  const originalNodeEnv = process.env.NODE_ENV;
  const names = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "AUTH_RATE_LIMIT_KEY_SECRET", "ADM_TRUSTED_CLIENT_IP_HEADER"] as const;
  const original = new Map(names.map((name) => [name, process.env[name]]));
  const environment = process.env as Record<string, string | undefined>;

  context.after(() => {
    if (originalNodeEnv === undefined) delete environment.NODE_ENV;
    else environment.NODE_ENV = originalNodeEnv;
    for (const name of names) {
      if (original.get(name) === undefined) delete environment[name];
      else environment[name] = original.get(name);
    }
  });

  environment.NODE_ENV = "production";
  for (const name of names) delete environment[name];

  await assert.rejects(
    isAuthRequestRateLimited(request(), "login", "person@example.test", options),
    (error: unknown) => error instanceof ApiError && error.statusCode === 503,
  );
});

test("rate-limited auth response is HTTP 429 and contains no identifier", async () => {
  const response = authFlowRateLimitedResponse();
  const body = await response.json();

  assert.equal(response.status, 429);
  assert.equal(body.message, "Too many requests. Try again later.");
  assert.equal(JSON.stringify(body).includes("person@example.test"), false);
});

test("Redis adapter uses one atomic Lua EVAL with co-located counters and bounded expiry", async () => {
  let invocation: { script: string; keys: string[]; args: string[] } | undefined;
  const store = createRedisAuthRateLimitStore({
    async eval(script: string, keys: string[], args: string[]) {
      invocation = { script, keys, args };
      return 1;
    },
  } as never, "adm:test-rate-limit");

  assert.equal(await store.consume([
    { key: "login:account:account-digest", limit: 8 },
    { key: "login:ip:ip-digest", limit: 30 },
  ], 900_000, 1_000), true);

  assert.ok(invocation);
  assert.equal(invocation.keys.length, 2);
  assert.deepEqual(invocation.args, ["8", "30", "900000"]);
  assert.match(invocation.script, /for i = 1, #KEYS do/);
  assert.match(invocation.script, /redis\.call\("INCR", KEYS\[i\]\)/);
  assert.match(invocation.script, /redis\.call\("PEXPIRE", KEYS\[i\], windowMs\)/);
  assert.deepEqual(
    invocation.keys.map((key) => key.match(/\{([^}]+)\}/)?.[1]),
    ["login", "login"],
    "account and IP counters must share a Redis Cluster hash slot",
  );
});

test("Redis adapter rejects unexpected script results rather than treating them as allowed", async () => {
  const store = createRedisAuthRateLimitStore({
    async eval() {
      return "allowed";
    },
  } as never);

  await assert.rejects(
    store.consume([{ key: "login:account:digest", limit: 8 }], 60_000, 1_000),
    /Unexpected limiter result/,
  );
});

test("Redis request timeout uses an abort signal with a bounded default", async () => {
  assert.equal(AUTH_RATE_LIMIT_TIMEOUT_MS, 1_500);
  const signal = createAuthRateLimitAbortSignal(5);
  await new Promise<void>((resolve) => {
    if (signal.aborted) return resolve();
    signal.addEventListener("abort", () => resolve(), { once: true });
  });
  assert.equal(signal.aborted, true);
});
