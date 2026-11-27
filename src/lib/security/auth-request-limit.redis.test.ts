import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { Redis } from "@upstash/redis";

import { createRedisAuthRateLimitStore } from "./auth-request-limit";

const testUrl = process.env.AUTH_RATE_LIMIT_TEST_REDIS_URL?.trim();
const testToken = process.env.AUTH_RATE_LIMIT_TEST_REDIS_TOKEN?.trim();
const testHostConfirmation = process.env.AUTH_RATE_LIMIT_TEST_REDIS_HOST_CONFIRM?.trim();
const isolatedFixtureConfirmation = process.env.AUTH_RATE_LIMIT_TEST_REDIS_ISOLATED?.trim();
const hasCompleteTestConfig = Boolean(testUrl && testToken && testHostConfirmation && isolatedFixtureConfirmation);
const REDIS_ISOLATION_CONFIRMATION = "I CONFIRM THIS IS A DEDICATED NON-PRODUCTION TEST REDIS INSTANCE";

test("Upstash Redis shares atomic limits across separate clients and expires counters", {
  skip: hasCompleteTestConfig ? false : "Dedicated Redis fixture and isolation confirmations not configured.",
}, async () => {
  assert.ok(testUrl, "AUTH_RATE_LIMIT_TEST_REDIS_URL is required when Redis integration testing is enabled.");
  assert.ok(testToken, "AUTH_RATE_LIMIT_TEST_REDIS_TOKEN is required when Redis integration testing is enabled.");
  assert.equal(isolatedFixtureConfirmation, REDIS_ISOLATION_CONFIRMATION,
    "Explicit non-Production Redis isolation confirmation is required.");

  let parsedTestUrl: URL;
  try {
    parsedTestUrl = new URL(testUrl);
  } catch {
    throw new Error("Dedicated Redis test URL is malformed; value suppressed.");
  }
  assert.equal(parsedTestUrl.protocol, "https:", "Redis test URL must use HTTPS.");
  assert.ok(parsedTestUrl.hostname.endsWith(".upstash.io"), "Redis integration requires the approved Upstash REST host.");
  assert.ok(!parsedTestUrl.username && !parsedTestUrl.password && !parsedTestUrl.search && !parsedTestUrl.hash,
    "Redis URL must not embed credentials or query values.");
  assert.ok(parsedTestUrl.pathname === "" || parsedTestUrl.pathname === "/",
    "Redis test URL must not contain a custom path.");
  assert.ok(testHostConfirmation === parsedTestUrl.hostname,
    "Redis test host confirmation must match; values suppressed.");

  const productionUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  if (productionUrl) {
    let parsedProductionUrl: URL | undefined;
    try {
      parsedProductionUrl = new URL(productionUrl);
    } catch {
      // A malformed Production setting cannot be the same target as the valid test URL.
    }
    assert.ok(
      !parsedProductionUrl || parsedProductionUrl.hostname !== parsedTestUrl.hostname,
      "Refusing to run the integration test against the configured Production Redis host.",
    );
  }

  const clientA = new Redis({
    url: testUrl,
    token: testToken,
    enableTelemetry: false,
    retry: false,
    signal: () => AbortSignal.timeout(10_000),
  });
  const clientB = new Redis({
    url: testUrl,
    token: testToken,
    enableTelemetry: false,
    retry: false,
    signal: () => AbortSignal.timeout(10_000),
  });
  const namespace = `adm:auth-rate-limit-integration:${randomUUID()}`;
  const storeA = createRedisAuthRateLimitStore(clientA, namespace);
  const storeB = createRedisAuthRateLimitStore(clientB, namespace);
  const consumeSafely = async (store: ReturnType<typeof createRedisAuthRateLimitStore>, key: string, limit: number, windowMs: number) => {
    try {
      return await store.consume([{ key, limit }], windowMs, Date.now());
    } catch {
      throw new Error("Dedicated Redis integration operation failed; provider details suppressed.");
    }
  };
  const concurrentKey = `integration-${randomUUID()}:account:test`;
  const limit = 7;

  const concurrentResults = await Promise.all(Array.from({ length: 42 }, (_, index) =>
    consumeSafely(index % 2 === 0 ? storeA : storeB, concurrentKey, limit, 10_000),
  ));

  assert.equal(concurrentResults.filter((limited) => !limited).length, limit);
  assert.equal(concurrentResults.filter(Boolean).length, 42 - limit);

  const expiringKey = `integration-${randomUUID()}:account:ttl`;
  const shortWindowMs = 1_000;
  assert.equal(await consumeSafely(storeA, expiringKey, 1, shortWindowMs), false);
  assert.equal(await consumeSafely(storeB, expiringKey, 1, shortWindowMs), true);
  await new Promise((resolve) => setTimeout(resolve, shortWindowMs + 250));
  assert.equal(await consumeSafely(storeB, expiringKey, 1, shortWindowMs), false);
});
