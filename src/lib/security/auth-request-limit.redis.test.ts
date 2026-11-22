import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { Redis } from "@upstash/redis";

import { createRedisAuthRateLimitStore } from "./auth-request-limit";

const testUrl = process.env.AUTH_RATE_LIMIT_TEST_REDIS_URL?.trim();
const testToken = process.env.AUTH_RATE_LIMIT_TEST_REDIS_TOKEN?.trim();
const hasAnyTestConfig = Boolean(testUrl || testToken);

test("Upstash Redis shares atomic limits across separate clients and expires counters", {
  skip: hasAnyTestConfig ? false : "Dedicated AUTH_RATE_LIMIT_TEST_REDIS_URL/TOKEN not configured.",
}, async () => {
  assert.ok(testUrl, "AUTH_RATE_LIMIT_TEST_REDIS_URL is required when Redis integration testing is enabled.");
  assert.ok(testToken, "AUTH_RATE_LIMIT_TEST_REDIS_TOKEN is required when Redis integration testing is enabled.");

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
  const concurrentKey = `integration-${randomUUID()}:account:test`;
  const limit = 7;

  const concurrentResults = await Promise.all(Array.from({ length: 42 }, (_, index) =>
    (index % 2 === 0 ? storeA : storeB).consume(
      [{ key: concurrentKey, limit }],
      10_000,
      Date.now(),
    ),
  ));

  assert.equal(concurrentResults.filter((limited) => !limited).length, limit);
  assert.equal(concurrentResults.filter(Boolean).length, 42 - limit);

  const expiringKey = `integration-${randomUUID()}:account:ttl`;
  const shortWindowMs = 1_000;
  assert.equal(await storeA.consume([{ key: expiringKey, limit: 1 }], shortWindowMs, Date.now()), false);
  assert.equal(await storeB.consume([{ key: expiringKey, limit: 1 }], shortWindowMs, Date.now()), true);
  await new Promise((resolve) => setTimeout(resolve, shortWindowMs + 250));
  assert.equal(await storeB.consume([{ key: expiringKey, limit: 1 }], shortWindowMs, Date.now()), false);
});
