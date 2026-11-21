import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 20_000;

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function trustedClientAddress(request: NextRequest) {
  const headerName = process.env.ADM_TRUSTED_CLIENT_IP_HEADER?.trim().toLowerCase();
  if (!headerName || !/^[a-z0-9-]{1,64}$/.test(headerName)) return null;
  const value = request.headers.get(headerName)?.trim();
  if (!value || value.length > 64 || /[,\s]/.test(value)) return null;
  return value;
}

function consume(key: string, limit: number, windowMs: number, now: number) {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function isAuthRequestRateLimited(
  request: NextRequest,
  action: string,
  identifier: string,
  options: { identifierLimit: number; ipLimit: number; windowMs: number },
  now = Date.now(),
) {
  if (buckets.size >= MAX_BUCKETS) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
    if (buckets.size >= MAX_BUCKETS) return true;
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const accountKey = digest(`${action}\0account\0${normalizedIdentifier}`);
  const accountAllowed = consume(
    accountKey,
    options.identifierLimit,
    options.windowMs,
    now,
  );

  const address = trustedClientAddress(request);
  if (!address) return !accountAllowed;

  const ipKey = digest(`${action}\0ip\0${address}`);
  const ipAllowed = consume(ipKey, options.ipLimit, options.windowMs, now);
  return !accountAllowed || !ipAllowed;
}

export function resetAuthRequestLimitsForTests() {
  buckets.clear();
}
