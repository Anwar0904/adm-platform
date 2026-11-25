import { randomBytes, randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const PREVIEW_HOST = /^adm-platform-git-security-[a-z0-9-]+-anwar0904s-projects\.vercel\.app$/i;
const REQUIRED_SCOPE_CONFIRMATION = "I CONFIRM THIS IS AN ISOLATED ADM PREVIEW WITH DEDICATED STAGING REDIS";
const MAX_LOGIN_PROBES = 9;
const REQUEST_TIMEOUT_MS = 7_000;

export function validatePreviewOrigin(value) {
  if (typeof value !== "string" || value !== value.trim()) {
    throw new Error("Target is not an approved ADM Preview origin.");
  }

  let target;
  try {
    target = new URL(value);
  } catch {
    throw new Error("Target is not an approved ADM Preview origin.");
  }

  if (
    target.protocol !== "https:" ||
    target.username ||
    target.password ||
    target.port ||
    target.pathname !== "/" ||
    target.search ||
    target.hash ||
    target.origin !== value ||
    !PREVIEW_HOST.test(target.hostname)
  ) {
    throw new Error("Target is not an approved ADM Preview origin.");
  }

  return target.origin;
}

export function expectedLoginStatuses() {
  return [...Array(MAX_LOGIN_PROBES - 1).fill(401), 429];
}

function ask(prompt) {
  const terminal = createInterface({ input: stdin, output: stdout });
  return terminal.question(prompt).finally(() => terminal.close());
}

async function requestStatus(url, init) {
  try {
    const response = await fetch(url, {
      ...init,
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return response.status;
  } catch {
    throw new Error("Preview request failed or timed out; response details were suppressed.");
  }
}

async function main() {
  if (process.env.ADM_PREVIEW_SECURITY_SMOKE !== "1") {
    throw new Error("Local Preview smoke guard is missing.");
  }
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error("An interactive local terminal is required.");
  }

  const origin = validatePreviewOrigin(process.env.ADM_PREVIEW_SECURITY_TARGET);
  const typedOrigin = await ask(`Confirm the exact isolated Preview origin (${origin}): `);
  if (typedOrigin.trim() !== origin) throw new Error("Preview origin confirmation did not match.");

  const scopeConfirmation = await ask(`Type exactly: ${REQUIRED_SCOPE_CONFIRMATION}\n> `);
  if (scopeConfirmation.trim() !== REQUIRED_SCOPE_CONFIRMATION) {
    throw new Error("Staging ownership confirmation did not match.");
  }

  console.log("Preview smoke started. No credentials, cookies, response bodies, or account identifiers will be printed.");
  const runtimeStatus = await requestStatus(new URL("/api/auth/me", origin), {
    method: "GET",
    headers: { accept: "application/json" },
  });
  console.log(`GET /api/auth/me: HTTP ${runtimeStatus} (expected 401 without a session)`);
  if (runtimeStatus !== 401) {
    throw new Error("Unauthenticated runtime status was unexpected; no rate-limit probes were sent.");
  }

  const syntheticEmail = `adm-preview-smoke-${randomUUID()}@example.invalid`;
  const syntheticPassword = `P${randomBytes(24).toString("hex")}!a1`;
  let receivedRateLimit = false;

  for (let attempt = 1; attempt <= MAX_LOGIN_PROBES; attempt += 1) {
    const status = await requestStatus(new URL("/api/auth/login", origin), {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        origin,
        "sec-fetch-site": "same-origin",
      },
      body: JSON.stringify({ email: syntheticEmail, password: syntheticPassword }),
    });

    console.log(`Synthetic login probe ${attempt}/${MAX_LOGIN_PROBES}: HTTP ${status}`);
    if (status === 429) {
      receivedRateLimit = true;
      if (attempt !== MAX_LOGIN_PROBES) {
        throw new Error("Rate limit activated before the expected account threshold.");
      }
      break;
    }
    if (status !== 401) {
      throw new Error("Login probe returned an unexpected status; remaining probes were stopped.");
    }
  }

  if (!receivedRateLimit) throw new Error("The bounded login probes did not receive HTTP 429.");
  console.log("PASS: one unauthenticated runtime status and bounded account-limit 429 check completed.");
  console.log("This does not prove cross-instance sharing or Redis timeout behavior; retain sanitized request IDs/metrics separately.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : "Preview smoke aborted.";
    console.error(`Preview smoke stopped: ${message}`);
    process.exitCode = 1;
  });
}
