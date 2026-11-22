# ADM security release signoff

**Review date:** 2026-11-21  
**Branch:** `security/platform-hardening-review`

**Base candidate:** `3dff3ecb9c9a5a7b337940038ee171ebf6835907`
**Pull request:** [#3](https://github.com/Anwar0904/adm-platform/pull/3), currently Draft  
**Decision:** **NO-GO — do not merge or deploy. Keep PR #3 Draft.**

The process-local rate-limit vulnerability has been remediated in the current uncommitted working tree with a shared Redis-backed implementation. This working tree has not been deployed or checked by GitHub/Vercel. The six passing checks are for the base candidate SHA above, not these changes. A dedicated Redis integration endpoint and Preview credentials are unavailable, so cross-client integration and Preview behavior remain unverified. Production configuration was not inspected or changed.

## 1. Vulnerability and remediation

The prior limiter stored counters in a JavaScript `Map` within one Vercel function process. Requests routed to other instances or cold starts did not share those counters, allowing an attacker to spread login and recovery attempts across instances and bypass the intended budgets.

The updated `src/lib/security/auth-request-limit.ts` uses the maintained `@upstash/redis` TypeScript SDK (version `1.41.0` in the lockfile), an HTTP client designed for serverless environments. A single Redis Lua script checks and increments all applicable account/IP counters atomically and sets each counter's expiry on its first accepted request. The script's keys use a shared action hash tag for Redis Cluster compatibility. Upstash documents the [TypeScript SDK](https://upstash.com/docs/redis/sdks/ts/overview) and [atomic Lua scripting](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval).

The existing route budgets and fixed-window expiry behavior are preserved:

| Endpoint | Per-account budget | Per-IP budget | Window |
| --- | ---: | ---: | --- |
| Login | 8 | 30 | 15 minutes |
| Registration | 3 | 10 | 1 hour |
| Password reset | 3 | 15 | 15 minutes |
| Verification resend | 3 | 15 | 1 hour |

Keys include an action namespace and HMAC-SHA256 digests of normalized account/IP identifiers; raw emails, IP addresses, passwords, JWTs, and recovery tokens are not put in keys. Production uses Vercel's proxy-overwritten `x-forwarded-for` header and fails closed if it is missing or invalid; the header cannot be selected from an environment variable in Production. Vercel documents the trusted forwarding behavior in its [request headers reference](https://vercel.com/docs/headers/request-headers). Other client-supplied forwarding headers are ignored.

When Redis is unavailable, partially configured, or times out, auth requests receive a generic HTTP 503. Production never falls back to process-local memory. Local development without Redis can use an in-memory store; it is not available as a Production fallback. Limit exhaustion continues to return the existing generic HTTP 429 response. Provider errors are not logged or returned.

## 2. Configuration requirements and assessment

Set these **server-side** variables separately for Preview and Production:

- `UPSTASH_REDIS_REST_URL` — HTTPS REST endpoint for the environment's Redis database.
- `UPSTASH_REDIS_REST_TOKEN` — scoped credential for that database.
- `AUTH_RATE_LIMIT_KEY_SECRET` — independent random secret of at least 32 UTF-8 bytes, used only for HMAC key derivation.

Do not use `NEXT_PUBLIC_` names. Use separate Redis databases and separate credentials/secrets for Preview and Production. Keep Redis limited to the required project/environment. Do not print values in deployment output or evidence. Production also requires Vercel's trusted `x-forwarded-for` header to be present as documented. `ADM_TRUSTED_CLIENT_IP_HEADER` may be used only for a deliberately trusted non-Production proxy; it cannot override the Production choice.

**Assessment:** No Upstash integration credentials, dedicated Redis test endpoint, Vercel CLI, or linked `.vercel/project.json` are available here. No Preview or Production environment settings were read or changed. A key-name-only local environment scan found no `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, or `AUTH_RATE_LIMIT_KEY_SECRET`; no values were displayed. The presence and scope of Preview and Production configuration and the user-stated Preview MongoDB isolation remain unverified. Redis configuration is a release blocker until an owner attests presence and scope and the Preview runtime check below passes.

## 3. Automated test evidence

Checks run against the current working tree on Node `v22.23.5`:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed. |
| `npm run lint` | Passed with 0 errors and 77 warnings. Warnings are existing repository lint warnings; no rule was disabled. |
| `npm test` | Plain invocation could not start test files because this Windows environment's TSX temp-directory initialization hit `uv_os_get_passwd returned ENOMEM`. Rerun unchanged with a temporary Node preload that supplies only a test temp username: 25 test files; 77 passed, 0 failed, 1 skipped. The shim was removed and did not alter tests. |
| `npm run build` | Passed; Next.js compiled and generated all 74 static pages. |
| `npm audit --audit-level=high` | Passed; `found 0 vulnerabilities`. The first sandboxed registry request was blocked; rerun with registry access succeeded. |

The new unit tests cover existing budgets, below/above-limit behavior, expiry semantics, concurrent calls against the in-memory test store, shared counters between separate limiter instances using a shared fake store, route namespace separation, trusted IP selection, HMAC key privacy, generic 503 fail-closed behavior, no Production memory fallback, and HTTP 429 response shape. These are unit tests and do not prove Redis distributes state.

An opt-in real Redis integration test creates two separate Upstash clients, submits concurrent requests against one shared Redis namespace, and checks expiry. It was **skipped**, because `AUTH_RATE_LIMIT_TEST_REDIS_URL` and `AUTH_RATE_LIMIT_TEST_REDIS_TOKEN` for a dedicated non-Production test database are not configured. No mock result is represented as distributed-backend evidence. The `@upstash/redis` dependency installation reported no vulnerabilities; the full audit result above includes the updated dependency tree.

The six GitHub/Vercel checks previously reported successful apply to base SHA `3dff3ecb9c9a5a7b337940038ee171ebf6835907`. They do not validate or deploy the current uncommitted changes. After review and commit by an authorized owner, CI must run on the resulting candidate SHA.

## 4. Preview verification procedure

No staging behavior has been verified. No Preview request, account, database, or mailbox was accessed during this work. After an owner configures dedicated Preview Redis, deploys the reviewed candidate to Preview, and confirms Preview database and mail routing are isolated from Production, perform these steps with dedicated test identities. Capture status codes, sanitized response shapes, and request IDs only. Keep credentials, cookies, bearer tokens, recovery links, raw Redis keys, and full HAR files out of output and logs.

1. **Read-only preflight:** Confirm the deployed SHA; Preview `NODE_ENV=production` behavior; separate MongoDB cluster/database; Preview-only mail sink/provider and callback origin; and presence/scope of the three Redis variables. Do not copy secret values or connection strings. Stop if isolation or scope is ambiguous.
2. **Login and throttling:** Use a dedicated active test account. Verify valid credentials return 200 with allowlisted user data and HttpOnly cookies (Secure, SameSite=Lax). Verify a wrong password and an unknown address return the same 401 body shape. From two independent runners or confirmed distinct Preview function instances, send nine invalid login attempts for that same account inside 15 minutes (four from A, five from B). Exactly eight should reach credential verification; excess attempts should return generic 429. Confirm the shared account counter without exposing its key or identifier. Do not use customer accounts.
3. **Logout and revocation:** Authenticate two isolated browser contexts for the same dedicated account, keeping cookie jars only in memory. In context A call `/api/auth/me`, then POST `/api/auth/logout`; verify its cookies are cleared. Replay context B's pre-logout cookies to `/api/auth/me` and `/api/auth/refresh`; both should reject the revoked session. Never print cookie values.
4. **Refresh rotation and access renewal:** Log in to a fresh session. POST `/api/auth/refresh` with a valid later `activityAt`; verify success and updated session cookies. Replay the prior refresh state from the second context and expect 409; verify the new state remains authenticated. For automatic access-token renewal, use only a Preview deployment with a temporary short access-token TTL, call a protected endpoint with both cookies after access expiry, verify renewal, then restore the ordinary Preview TTL. Do not change Production settings.
5. **Password reset:** Request reset for a known test address and an unknown address; expect the same generic 202 response and no token in either response. Only the controlled known-account inbox should receive the message. Verify the link token is in the URL fragment and is removed by the client before its API request. Reset once; verify the new password works, old password fails, sessions are revoked, and token reuse returns 400. For expiry, issue a separate test token, wait 16 minutes (15-minute token lifetime), and expect 400 with no password change. Repeat four reset requests within 15 minutes across two runners; expect only three allowed and excess request(s) to receive 429.
6. **Email verification:** For a dedicated unverified account, compare resend responses with an unknown address; expect the same generic status/body and mail only to the controlled inbox. Verify once; reusing that token must return 400. Use a second test account/token, wait 16 minutes, and verify expiry rejection while the account remains unverified. Verify no token appears in API responses or logs.
7. **RBAC and restricted routes:** With no cookies, request `/api/users`, `/api/roles`, `/api/media`, and `/api/settings`; expect 401/403 and no protected data. Repeat reads/writes with a read-only account and expect unauthorized writes to fail. With a disposable `USER_CREATE` but no `ROLE_UPDATE` test role, attempt role assignment to a disposable Preview record; expect 403 and no record change. Verify an admin can perform only its assigned permissions. Do not invoke destructive endpoints.
8. **Diagnostics and errors:** After confirming Preview runs production mode, GET `/api/test-db` and send an unauthenticated POST to `/api/seed/roles`; both should return 404 before database/seed work. Review sanitized Preview logs and responses for absence of tokens, cookies, credentials, raw exception messages, database details, or provider bodies.
9. **Closeout:** Record test date, deployed SHA, runner/region evidence, request outcomes, and masked configuration-presence attestations. Do not record secrets, raw Redis keys, or account identifiers. Preserve fixtures for the staging owner; do not perform cleanup writes or touch Production.

## 5. Remaining vulnerabilities and limitations

- No known Critical source vulnerability was found in the prior review; the existing fixes for recovery-token disclosure and caller-supplied password-change identity still require deployed behavior confirmation.
- The identified High distributed-rate-limit weakness is fixed in the current source tree, but real Redis integration and Preview cross-instance enforcement have not been verified. Until then, treat the production control as unproven and release-blocking.
- Preview/Production Redis variable presence, scope, connectivity, failover behavior, and Vercel trusted client-IP propagation remain unverified. If Redis is unavailable, authentication endpoints intentionally fail closed with 503, which protects the limit but impacts availability.
- Full staging flows remain untested: login, session revocation, refresh replay, recovery/verification single use and expiry, account enumeration, email delivery, RBAC, and restricted diagnostics. Upload integration, deployed headers/TLS, database permissions, storage policy, and backup/restore were not in scope for this targeted remediation and retain their prior review gates.
- There is no independent real Redis execution evidence. The opt-in test can prove atomic multi-client behavior only when run against a dedicated non-Production Redis database. Do not claim the shared fake-store unit test proves distributed correctness.

## 6. Production prerequisites, rollout, and rollback

Before release, an authorized owner must attest **presence and scope only**, without exposing values, for:

- Production-only `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AUTH_RATE_LIMIT_KEY_SECRET` with a dedicated Production Redis database and independent >=32-byte HMAC secret; Preview must have a separate database and credentials.
- `NODE_ENV=production`; public signup disabled (`AUTH_PUBLIC_SIGNUP_ENABLED` unset or `false`).
- `MONGODB_URI` and `MONGODB_DB` identify the approved Production database and differ from Preview. Confirm with masked identifiers or owner attestation, never by copying connection strings.
- Strong, distinct Production `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- If email flows are enabled: `AUTH_EMAIL_PROVIDER`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, `AUTH_EMAIL_BASE_URL`, and `ADM_ALLOWED_ORIGINS` have correct Production scope, verified sender domain, HTTPS origin, and Preview-only mail routing for staging.
- Vercel's trusted `x-forwarded-for` is present and overwritten by the Vercel edge; Production must not rely on a user-configured spoofable header.
- The deployment owner has verified TLS, response headers, database/storage access policy, backup/restore, alerting, rollback target, and monitoring owner under the wider release gates.

No Production values/settings were accessed or changed. Do not deploy until a candidate SHA passes CI, the real Redis integration test, the Preview procedure above, and the separate Production scope attestation.

For an approved rollout, record the last known-good deployment/SHA, candidate SHA, deployment ID, rollback owner, and observation window. Deploy only through the authorized release process. Monitor auth 401/403/429/5xx rates, Redis timeout/error and latency, session refresh conflicts, email failures, MongoDB errors, and user reports. If Redis errors prevent authentication or limits fail, stop rollout and restore the last known-good deployment/configuration; keep rate limiting fail-closed and investigate before retrying. Recheck authentication/session behavior after rollback. Preserve sanitized evidence and rotate credentials/revoke sessions only if exposure is confirmed.

## 7. Release decision

**NO-GO for merge and Production release.** The local remediation is implemented and all requested code quality checks pass (with the Windows test-runner workaround documented above), but the real Redis integration test was skipped and Preview behavior/configuration is unverified. The six GitHub/Vercel checks cover only the base SHA, not this working tree. Production environment scopes were not inspected. Keep PR #3 Draft; do not merge, deploy, or convert it to Ready for Review until the distributed Redis test, Preview staging procedure, and Production prerequisites are evidenced against the reviewed candidate SHA. No commit, push, merge, or Production deployment was performed.
