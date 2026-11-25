import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

import { ApiError } from "@/lib/api/api-error";

type Counter = { key: string; limit: number };
type LimitOptions = { identifierLimit: number; ipLimit: number; windowMs: number };

export const AUTH_REQUEST_LIMITS = {
  login: { identifierLimit: 8, ipLimit: 30, windowMs: 15 * 60_000 },
  register: { identifierLimit: 3, ipLimit: 10, windowMs: 60 * 60_000 },
  passwordReset: { identifierLimit: 3, ipLimit: 15, windowMs: 15 * 60_000 },
  passwordResetCompletion: { identifierLimit: 5, ipLimit: 30, windowMs: 15 * 60_000 },
  emailVerification: { identifierLimit: 3, ipLimit: 15, windowMs: 60 * 60_000 },
} as const;

export interface AuthRateLimitStore {
  consume(counters: Counter[], windowMs: number, now: number): Promise<boolean>;
}

const KEY_NAMESPACE = "adm:auth-rate-limit:v1";
const REDIS_TIMEOUT_MS = 1_500;
const MAX_LOCAL_BUCKETS = 20_000;
const LOCAL_DEVELOPMENT_KEY = "adm-local-auth-rate-limit-key-not-for-production";
const AUTH_RATE_LIMIT_UNAVAILABLE = "Authentication is temporarily unavailable.";
const VERCEL_TRUSTED_CLIENT_IP_HEADER = "x-forwarded-for";

const ATOMIC_CONSUME_SCRIPT = `
local blocked = 0
local windowMs = tonumber(ARGV[#KEYS + 1])

for i = 1, #KEYS do
  local limit = tonumber(ARGV[i])
  local current = tonumber(redis.call("GET", KEYS[i]) or "0")

  if current >= limit then
    blocked = 1
  else
    local nextCount = redis.call("INCR", KEYS[i])
    if nextCount == 1 then
      redis.call("PEXPIRE", KEYS[i], windowMs)
    end
  end
end

return blocked
`;

function unavailable(): ApiError {
  return new ApiError(503, AUTH_RATE_LIMIT_UNAVAILABLE);
}

export function createInMemoryAuthRateLimitStore(): AuthRateLimitStore {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return {
    async consume(counters, windowMs, now) {
      if (buckets.size >= MAX_LOCAL_BUCKETS) {
        for (const [key, bucket] of buckets) {
          if (bucket.resetAt <= now) buckets.delete(key);
        }
        if (buckets.size >= MAX_LOCAL_BUCKETS) return true;
      }

      let blocked = false;
      for (const { key, limit } of counters) {
        const bucket = buckets.get(key);
        if (!bucket || bucket.resetAt <= now) {
          buckets.set(key, { count: 1, resetAt: now + windowMs });
        } else if (bucket.count >= limit) {
          blocked = true;
        } else {
          bucket.count += 1;
        }
      }

      return blocked;
    },
  };
}

export function createRedisAuthRateLimitStore(
  redis: Pick<Redis, "eval">,
  namespace = KEY_NAMESPACE,
): AuthRateLimitStore {
  return {
    async consume(counters, windowMs) {
      const result: unknown = await redis.eval(
        ATOMIC_CONSUME_SCRIPT,
        counters.map(({ key }) => `${namespace}:{${key.split(":")[0]}}:${key}`),
        [...counters.map(({ limit }) => String(limit)), String(windowMs)],
      );

      if (result !== 0 && result !== 1) throw new Error("Unexpected limiter result.");
      return result === 1;
    },
  };
}

function trustedClientAddress(request: NextRequest, headerName: string | undefined, required: boolean) {
  if (!headerName) {
    if (required) throw unavailable();
    return null;
  }

  const normalizedHeader = headerName.trim().toLowerCase();
  if (!/^[a-z0-9-]{1,64}$/.test(normalizedHeader)) throw unavailable();
  const address = request.headers.get(normalizedHeader)?.trim();
  if (!address || address.length > 64 || /[,{\s]/.test(address) || !isIP(address)) {
    if (required) throw unavailable();
    return null;
  }

  return address;
}

function deriveKey(secret: string, action: string, kind: "account" | "ip", value: string) {
  const digest = createHmac("sha256", secret)
    .update(`${kind}\0${value}`)
    .digest("hex");
  return `${action}:${kind}:${digest}`;
}

function validateAction(action: string) {
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(action)) throw unavailable();
  return action.toLowerCase();
}

function isSecureRedisUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      (url.pathname === "" || url.pathname === "/");
  } catch {
    return false;
  }
}

export function createAuthRequestLimiter(config: {
  store: AuthRateLimitStore;
  keySecret: string;
  trustedIpHeader?: string;
  requireTrustedIp?: boolean;
}) {
  return async function isLimited(
    request: NextRequest,
    action: string,
    identifier: string,
    options: LimitOptions,
    now = Date.now(),
  ) {
    if (
      !config.keySecret ||
      !Number.isSafeInteger(options.identifierLimit) || options.identifierLimit < 1 ||
      !Number.isSafeInteger(options.ipLimit) || options.ipLimit < 1 ||
      !Number.isSafeInteger(options.windowMs) || options.windowMs < 1
    ) {
      throw unavailable();
    }

    const routeNamespace = validateAction(action);
    const normalizedIdentifier = identifier.trim().toLowerCase();
    if (!normalizedIdentifier) throw unavailable();

    const counters: Counter[] = [{
      key: deriveKey(config.keySecret, routeNamespace, "account", normalizedIdentifier),
      limit: options.identifierLimit,
    }];

    const clientAddress = trustedClientAddress(
      request,
      config.trustedIpHeader,
      config.requireTrustedIp ?? false,
    );
    if (clientAddress) {
      counters.push({
        key: deriveKey(config.keySecret, routeNamespace, "ip", clientAddress),
        limit: options.ipLimit,
      });
    }

    try {
      return await config.store.consume(counters, options.windowMs, now);
    } catch {
      // Do not log the provider exception: SDK errors can contain request metadata.
      throw unavailable();
    }
  };
}

let developmentStore = createInMemoryAuthRateLimitStore();
let redisStore: AuthRateLimitStore | undefined;
let redisConfigKey: string | undefined;

function getRuntimeLimiter() {
  const production = process.env.NODE_ENV === "production";
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const keySecret = process.env.AUTH_RATE_LIMIT_KEY_SECRET?.trim();
  // Vercel overwrites x-forwarded-for with the client IP. Never choose a
  // Production IP header from an environment value that could point at spoofable input.
  const trustedIpHeader = production
    ? VERCEL_TRUSTED_CLIENT_IP_HEADER
    : process.env.ADM_TRUSTED_CLIENT_IP_HEADER?.trim();

  if (!production && !url && !token) {
    return createAuthRequestLimiter({
      store: developmentStore,
      keySecret: keySecret || LOCAL_DEVELOPMENT_KEY,
      trustedIpHeader,
    });
  }

  if (
    !url || !token || !keySecret ||
    Buffer.byteLength(keySecret, "utf8") < 32 ||
    !isSecureRedisUrl(url)
  ) {
    throw unavailable();
  }

  const currentConfigKey = `${url}\0${token}\0${keySecret}`;
  if (!redisStore || redisConfigKey !== currentConfigKey) {
    const redis = new Redis({
      url,
      token,
      enableTelemetry: false,
      retry: false,
      signal: () => AbortSignal.timeout(REDIS_TIMEOUT_MS),
    });
    redisStore = createRedisAuthRateLimitStore(redis);
    redisConfigKey = currentConfigKey;
  }

  return createAuthRequestLimiter({
    store: redisStore,
    keySecret,
    trustedIpHeader,
    requireTrustedIp: production,
  });
}

export async function isAuthRequestRateLimited(
  request: NextRequest,
  action: string,
  identifier: string,
  options: LimitOptions,
  now = Date.now(),
) {
  return getRuntimeLimiter()(request, action, identifier, options, now);
}

// Test-only reset for the local development fallback.
export function resetAuthRequestLimitsForTests() {
  developmentStore = createInMemoryAuthRateLimitStore();
}
