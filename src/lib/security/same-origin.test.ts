import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/api-error";
import { enforceSameOrigin } from "./same-origin";

const vercelEnvironmentKeys = ["VERCEL", "VERCEL_ENV", "VERCEL_URL", "VERCEL_BRANCH_URL"] as const;

function withVercelEnvironment(values: Partial<Record<(typeof vercelEnvironmentKeys)[number], string>>, run: () => void) {
  const previous = Object.fromEntries(vercelEnvironmentKeys.map((key) => [key, process.env[key]]));
  for (const key of vercelEnvironmentKeys) delete process.env[key];
  Object.assign(process.env, values);
  try {
    run();
  } finally {
    for (const key of vercelEnvironmentKeys) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

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

test("same-origin guard permits the current Vercel Preview deployment origin", () => {
  withVercelEnvironment({
    VERCEL: "1",
    VERCEL_ENV: "preview",
    VERCEL_URL: "adm-platform-git-security-review-example.vercel.app",
  }, () => {
    const request = new NextRequest("https://adm-platform-git-security-review-example.vercel.app/api/auth/login", {
      method: "POST",
      headers: { origin: "https://adm-platform-git-security-review-example.vercel.app", "sec-fetch-site": "same-origin" },
    });
    assert.doesNotThrow(() => enforceSameOrigin(request, { requireOrigin: true }));
  });
});

test("same-origin guard permits the stable Vercel branch Preview origin", () => {
  withVercelEnvironment({
    VERCEL: "1",
    VERCEL_ENV: "preview",
    VERCEL_URL: "adm-platform-deployment-123.vercel.app",
    VERCEL_BRANCH_URL: "adm-platform-git-security-review.vercel.app",
  }, () => {
    const request = new NextRequest("https://adm-platform-git-security-review.vercel.app/api/auth/login", {
      method: "POST",
      headers: { origin: "https://adm-platform-git-security-review.vercel.app", "sec-fetch-site": "same-origin" },
    });
    assert.doesNotThrow(() => enforceSameOrigin(request, { requireOrigin: true }));
  });
});

test("same-origin guard keeps the configured Production origin and excludes Preview metadata", () => {
  withVercelEnvironment({
    VERCEL: "1",
    VERCEL_ENV: "production",
    VERCEL_URL: "adm-platform-production.vercel.app",
    VERCEL_BRANCH_URL: "adm-platform-git-security-review.vercel.app",
  }, () => {
    const productionRequest = new NextRequest("https://arazidigitalmedia.com/api/auth/login", {
      method: "POST",
      headers: { origin: "https://arazidigitalmedia.com", "sec-fetch-site": "same-origin" },
    });
    assert.doesNotThrow(() => enforceSameOrigin(productionRequest, { requireOrigin: true }));

    const previewRequest = new NextRequest("https://adm-platform-git-security-review.vercel.app/api/auth/login", {
      method: "POST",
      headers: { origin: "https://adm-platform-git-security-review.vercel.app", "sec-fetch-site": "same-origin" },
    });
    assert.throws(() => enforceSameOrigin(previewRequest, { requireOrigin: true }), isForbidden);
  });
});

test("same-origin guard rejects untrusted and malformed origins", () => {
  const untrustedRequest = new NextRequest("https://app.example.test/api/auth/login", {
    method: "POST",
    headers: { origin: "https://attacker.example", "sec-fetch-site": "same-origin" },
  });
  const malformedRequest = new NextRequest("https://app.example.test/api/auth/login", {
    method: "POST",
    headers: { origin: "https://arazidigitalmedia.com/login", "sec-fetch-site": "same-origin" },
  });

  assert.throws(() => enforceSameOrigin(untrustedRequest, { requireOrigin: true }), isForbidden);
  assert.throws(() => enforceSameOrigin(malformedRequest, { requireOrigin: true }), isForbidden);
});

test("same-origin guard rejects cross-site metadata even for an allowed origin", () => {
  const request = new NextRequest("https://arazidigitalmedia.com/api/auth/login", {
    method: "POST",
    headers: { origin: "https://arazidigitalmedia.com", "sec-fetch-site": "cross-site" },
  });
  assert.throws(() => enforceSameOrigin(request, { requireOrigin: true }), isForbidden);
});

test("Bearer authorization does not bypass cross-site origin or Fetch Metadata checks", () => {
  const request = new NextRequest("https://app.example.test/api/auth/login", {
    method: "POST",
    headers: {
      authorization: "Bearer explicit-client-token",
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
    },
  });

  assert.throws(
    () => enforceSameOrigin(request, { requireOrigin: true }),
    isForbidden,
  );
});

test("same-origin guard rejects a spoofed Host header", () => {
  withVercelEnvironment({
    VERCEL: "1",
    VERCEL_ENV: "preview",
    VERCEL_URL: "adm-platform-preview.vercel.app",
  }, () => {
    const request = new NextRequest("https://adm-platform-preview.vercel.app/api/auth/login", {
      method: "POST",
      headers: {
        origin: "https://adm-platform-preview.vercel.app",
        host: "attacker.example",
        "sec-fetch-site": "same-origin",
      },
    });
    assert.throws(() => enforceSameOrigin(request, { requireOrigin: true }), isForbidden);
  });
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

function isForbidden(error: unknown) {
  return error instanceof ApiError && error.statusCode === 403;
}
