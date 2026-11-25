# ADM security release signoff

**Review date:** 2026-11-24

**Branch:** `security/platform-hardening-review`

**PR:** [#3](https://github.com/Anwar0904/adm-platform/pull/3)

**PR head at review:** `cc555489b91b15dd81fd3a0bc69b77c7310c51f2`

**Working tree:** contains uncommitted security changes listed below; remote CI has not run on these changes.
**Decision:** **NO-GO for merge or Production release.**

This is a targeted source review and local verification, not an end-to-end staging or Production penetration test. No Production data, credentials, configuration, or services were accessed or changed. No databases were seeded or reset, and no deployment or merge was performed.

## Executive assessment

- Server authorization is enforced through `requirePermission` in the Users and Roles API handlers. New regression tests exercise a `USER_READ`-only role and the existing Super Admin bypass.
- Authentication/session, CSRF, token-expiry, and rate-limit implementation tests pass locally. These tests use mocks or in-memory stores; they do not prove deployed behavior.
- A source review found that password-reset completion had no distributed request limit, despite hashing a submitted password before checking the reset token. The local candidate now applies a distributed limit before reset processing: 5 per token and 30 per trusted client IP per 15 minutes. It shares the existing fail-closed Redis limiter. This change is uncommitted and has not run in Preview.
- No live Preview credentials, controlled mail inbox, Redis test configuration, or Vercel settings were available. Runtime flows and environment isolation remain **UNVERIFIED**.
- GitHub's latest six-check quality run passed for PR head `cc555489`, before this working-tree change. The local candidate still needs to be committed/pushed and pass CI before it is eligible for merge.

## Local checks and evidence

Commands were executed in this workspace on Node `v22.23.5`:

| Check | Result | Scope and limitation |
| --- | --- | --- |
| `npm run typecheck` | **PASS** | TypeScript no-emit check, including the new permission tests. |
| `npm run lint` | **PASS** | Exit 0; 76 warnings, 0 errors. Warnings include existing unused declarations, anonymous default exports, and `<img>` usage. |
| `npm test` | **PASS with workaround** | The first run could not start test workers because this host's Node `os.userInfo()` returned `uv_os_get_passwd ENOMEM`. The suite was rerun with a temporary local Node preload shim for `os.userInfo`; the shim was removed afterward and did not change application or test assertions. Result: 92 tests, 91 passed, 0 failed, 1 skipped. The skipped test is the optional Upstash Redis integration test because dedicated test Redis settings were not supplied. |
| `npm run build` | **PASS** | Next.js 16.4.5 production build completed using synthetic CI-style site/JWT/Mongo settings and a temporary build output directory. Next reported `.env.local` as loaded; its contents were not opened, printed, or recorded. The generated output directory was removed and generated `tsconfig.json` include entries were reverted. No live API flow was exercised by the build. |
| `git diff --check` | **PASS** | No whitespace errors in the reviewed diff. |

GitHub Actions run #18 reported all six checks passing for the PR head SHA above. Those results predate the uncommitted changes in this working tree and do not validate them. The PR remains open and unmerged; no independent review is recorded in the PR metadata available to this review.

### Automated security coverage

- `src/lib/auth/permission-enforcement.test.ts` verifies that a role with only `USER_READ` can pass that server-side permission check but receives 403 for user create/update/delete and role read/create/update/delete operations. It also checks that Super Admin continues to pass those permission checks. Authentication, session lookup, and the user record are mocked; API handlers are not invoked over HTTP.
- Existing auth service tests cover logout revocation, stale refresh-token replay, concurrent refresh rotation, session checks, reset/verification token behavior, and generic login errors. They are service-level tests with mocked persistence.
- Existing same-origin tests cover allowed configured/Preview origins, malformed and untrusted origins, cross-site fetch metadata, and spoofed Host mismatch. These are unit tests, not browser tests against the deployed Vercel host.
- Existing limiter tests cover atomic budgets, generic 429 responses, generic fail-closed 503 responses, and production refusal to fall back to memory. The shared-store unit test uses an in-memory backend. The optional Upstash integration test was skipped.
- The new password-reset completion limit is exercised by a configuration assertion in the limiter unit tests. No real Redis or deployed endpoint tested its HTTP 429 behavior.

## Source review findings

### Critical

No Critical issue was identified in this targeted review. This is not a complete application security audit.

### High — release blockers

1. **Deployed authentication and authorization flows are unverified.** Logout/revocation, refresh rotation and replay, expiry, reset and verification email delivery/expiry, role-denied API requests, Super Admin operations, and same-origin behavior were not exercised against Preview. The operator previously reported that Preview login and dashboard access work; that report was not independently reproduced here.
2. **Distributed limiter runtime is unverified.** No real Preview HTTP 429 threshold, shared Redis behavior through Vercel functions, timeout, or HTTP 503 fail-closed response was measured. The optional Redis integration test was skipped. Production timeout is 1,500 ms; whether cold/warm Redis latency fits that deadline is unknown.
3. **Environment isolation and Production readiness are unattested.** This review had no read-only access to Vercel environment scopes, MongoDB project/database identity, mail routing, Redis projects, function region, deployment runtime, or rollback target. Source code cannot establish that Preview and Production use separate resources.
4. **The local candidate has not passed remote CI or independent review.** The six successful GitHub checks are for the prior PR head. The role and reset-limit changes are uncommitted, and no independent PR review is recorded.

### Medium

1. **MongoDB database name has a production fallback.** `src/config/env.ts` defaults `MONGODB_DB` to `adm-website`, including when `NODE_ENV` is production. `src/lib/db.ts` passes that value as Mongoose `dbName`, so the URI's path alone does not prove the selected database. Release owners must explicitly attest the scoped database name and Preview/Production separation. No environment was changed.
2. **Content Security Policy is not configured in the repository's Next headers.** `next.config.ts` sets frame, MIME sniffing, referrer, and permissions headers but does not define CSP or HSTS. Actual Vercel/edge response headers and TLS behavior were not observed. Assess CSP compatibility and verify deployed headers before release.
3. **Reset completion required an abuse limit.** The prior handler had no limiter and proceeded to password hashing before token validity was established. The local candidate adds a per-token and per-IP distributed limit before `AuthService.resetPassword`. This is a source-level remediation only; it remains uncommitted and has no deployed verification.

### Low

1. ESLint exits successfully but reports 76 warnings across the repository. They are not all security issues and were not broadly cleaned up in this focused change.
2. The test suite requires a host-specific `os.userInfo` shim in this workspace. CI's Linux test result is green on the prior PR head; the local workaround is not part of the repository.

## Configuration, endpoints, and operational review

- **Runtime:** `.nvmrc` selects Node 22 and `package.json` declares `>=22 <23`. This is the repository/CI runtime intent; the actual Vercel Preview and Production runtime selection remains unverified.
- **Required server settings:** production code requires `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AUTH_RATE_LIMIT_KEY_SECRET` for the relevant paths. Redis URL must be HTTPS; the HMAC key must be at least 32 UTF-8 bytes. `MONGODB_DB` currently has a fallback and should be explicitly set. Email delivery uses `AUTH_EMAIL_PROVIDER`, `AUTH_EMAIL_BASE_URL`, `AUTH_EMAIL_FROM`, and `RESEND_API_KEY` when configured. Variable presence and environment scope were not inspected in Vercel. No secret values are included here.
- **Redis:** Production code uses Upstash with retries disabled and a 1,500 ms abort timeout. Production uses the fixed Vercel `x-forwarded-for` source and refuses missing trusted IP or missing Redis settings; it does not fall back to a process-local limiter. Store failures return generic 503; exhausted limits return generic 429. Preview and Production Redis separation is not verified.
- **MongoDB:** Production rejects localhost URIs, but the application does not enforce that the URI/database differs from Preview. Database/cluster identity and least-privilege credentials were not checked.
- **Sessions/cookies:** access and refresh cookies are HttpOnly, SameSite=Lax, path `/`, and use `Secure` when `NODE_ENV === "production"`. Confirm that deployed Preview and Production set production mode. Session and refresh revocation logic has automated service tests but no live-session replay test in this review.
- **Origin/CSRF:** unsafe cookie-based requests require a valid configured origin; Preview may additionally use exact `VERCEL_URL`/`VERCEL_BRANCH_URL` metadata only when `VERCEL=1` and `VERCEL_ENV=preview`. Cross-site Fetch Metadata and Host mismatch are denied. Production Preview metadata is not trusted by that code path. Tests are unit-level.
- **Restricted endpoints:** `/api/test-db` returns 404 in production before connecting. `/api/seed/roles` returns 404 in production before DB access; in non-production it requires Super Admin and runs the legacy role seeder if explicitly called. The disabled legacy seed script was not run. No public bootstrap endpoint was found in the reviewed routes.
- **Logging:** targeted auth code logs mail-delivery failure kind and error code, not credentials or token content. No runtime log review was possible. Do not collect raw cookies, tokens, recovery links, connection strings, Redis keys, or full HARs for manual tests.
- **Rollback:** no current Production deployment ID, last-known-good SHA, rollback owner, or observation window was available. Do not release until the owner records and verifies those prerequisites.

## Required Preview-only checks

Run these only with an owner-confirmed Preview deployment, isolated staging database/Redis, disposable accounts, and a controlled mail sink. Do not use Production traffic or data.

1. Log in and out; replay the same revoked session from a second isolated client and verify `/api/auth/me` and refresh reject it.
2. Rotate a refresh token, replay the old refresh state, and verify rejection without invalidating the newly rotated session. Confirm expired/invalid sessions reject.
3. Complete password reset and email verification once; verify token replay and expiry reject, old password no longer works, and all relevant prior sessions are revoked. Compare unknown-account and known-account recovery responses for generic shape.
4. Use `staging_viewer` to call Users POST/PATCH/DELETE and all role-management endpoints directly; verify 403 and no state change. Verify Super Admin allowed operations through the API. Do not rely on UI visibility.
5. On a dedicated disposable account, exceed the configured login limit (8 per account and 30 per IP per 15 minutes) and reset-initiation limit (3 per account and 15 per IP per 15 minutes). Verify generic HTTP 429. Also verify reset completion is limited to 5 per token and 30 per IP per 15 minutes. Stop once limits are demonstrated; do not generate repeated mail.
6. In Preview only, test Redis timeout/unavailability and verify generic HTTP 503 without auth/recovery processing. Measure warm and cold request latency and report p50/p95/p99 and 503 counts against the 1,500 ms Redis deadline. Do not induce this failure in Production.
7. Read-only attest Preview/Production DB, Redis, mail and secret scopes are distinct; confirm Node 22 runtime, `NODE_ENV`, secure cookies, deployed headers, and a tested rollback target.

Record only deployment SHA, sanitized status codes, timestamps/request IDs, latency summaries, and masked configuration-presence attestations. Never record credential values, tokens, cookies, raw IP/account identifiers, database URIs, or raw Redis keys.

## Release decision

**NO-GO for merge and Production release.** Local typecheck, lint, automated tests, and build pass with the limitations above. The new authorization tests are mocked, the Upstash integration test was skipped, and the real Preview flows, distributed rate-limit outcomes, environment isolation, Production runtime, and rollback readiness remain unverified. The local security changes need review and a fresh successful CI run. Obtain independent security review and complete the Preview-only gates before reconsidering GO. PR #3 remains unmerged and must stay out of Production until these blockers are closed.
