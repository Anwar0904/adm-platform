# ADM security release signoff

**Review date:** 2026-11-25

**Branch:** `security/platform-hardening-review`

**PR:** [#3](https://github.com/Anwar0904/adm-platform/pull/3)

**Security code candidate SHA:** `beb9127e6be3114dbe618c43c122539259c93afb`

**Sign-off revision:** Documentation-only follow-up to the code candidate; the final PR head is recorded in GitHub after this sign-off commit.

**Worktree:** Security code and tests are committed on the security branch. This sign-off update is the only pending change; it does not alter runtime code.

**Decision:** **NO-GO for merge or Production release.**

Status labels: **PASSED** means direct evidence exists for the stated scope; **FAILED** means a check ran and failed; **BLOCKED** means it is unsafe or awaiting an owner/reviewer; **UNVERIFIED** means no direct evidence was collected.

No Production data, configuration, credentials, or services were accessed or changed. No database was seeded/reset, no live Preview request was sent during this review, no fault injection was run, and PR #3 was not merged.

## Verified checks

| Check | Status | Evidence and limit |
| --- | --- | --- |
| GitHub Actions quality workflow #20 | **PASSED** | Run `45650521859` completed successfully on code SHA `beb9127e6be3114dbe618c43c122539259c93afb`: dependency audit, production build, ESLint, and TypeScript/unit tests. This is the first remote check of the new changes. |
| GitHub Actions quality workflow #19 | **PASSED (prior SHA)** | Run `45623731517` passed for `da77e82c7f1be92e20839c70248f34e7a0971feb`; it predates the current code candidate. |
| Vercel status for code candidate | **UNVERIFIED** | GitHub has no current commit status for `beb9127`. The prior Ready Preview comment refers to `da77e82`; it does not establish deployment of this code candidate. |
| Local checks on code candidate | **PASSED LOCALLY WITH HOST LIMITATION** | Typecheck passed; full lint exited 0 with 76 warnings before the last small auth guard changes and targeted ESLint passed afterward; production build passed with synthetic core configuration. The 32-file TypeScript suite passed 111, failed 0, skipped 1; the separate Preview policy suite passed 3/3. The skipped test is optional Upstash integration. Plain `npm test` fails before assertions in this Windows Node 22.23.5 sandbox because `tsx` calls `os.userInfo()` and receives `uv_os_get_passwd ENOMEM`; the same suite passed with an invocation-only temporary shim, which was removed. Remote Node 22 CI run #20 passed without that workaround. |
| Users/Role API route-handler authorization tests | **PASSED LOCALLY** | Tests call the actual Users and Roles route handlers with the real `requirePermission` path, fake active session/user fixtures, and stubbed services. They verify viewer denial before JSON parsing/mutation, `ROLE_UPDATE` separation, and Super Admin access. No MongoDB connection or real user records are used. Not yet run by GitHub CI. |
| Auth expiry/revocation/origin regression tests | **PASSED LOCALLY** | Tests cover logout revocation only with the current refresh token, rejection of stale rotated-token logout, invalid/expired/revoked access sessions, refresh replay/concurrency, reset success/expiry, verification success/expiry, cross-site Bearer rejection by the actual login handler, and auth route origin denial. Service/session storage is mocked; no live session or mail service was exercised. Not yet run by GitHub CI. |
| Redis adapter tests | **PASSED LOCALLY** | Mocked `eval` tests cover one atomic Lua call, hash-slot colocation, limits/expiry arguments, unexpected result failure, 1,500 ms abort-signal wiring, and generic 503 behavior. The real Upstash integration test skipped because no explicitly confirmed isolated Redis fixture was configured. |
| Preview smoke harness policy tests | **PASSED LOCALLY** | 3/3 pure tests cover approved ADM Preview host format, Production/custom/other-project target rejection, and the hard cap of nine login requests. The live harness was not run. |
| Local-only bootstrap deployment guard | **PASSED (static review)** | `.vercelignore` excludes `scripts/bootstrap-preview-admin.local.ts`; the script requires explicit local-only, database, Atlas-host, exclusive staging, and per-write confirmations. The script was not executed and made no database writes. |
| Independent review | **BLOCKED** | PR #3 is still draft and open; GitHub reports no submitted reviews and no requested reviewers. All PR commits are authored by the PR owner. No eligible independent reviewer was identifiable in available PR metadata, so no reviewer request was sent and no independent findings exist. |

At code-candidate review, PR #3 was open/draft/unmerged with 15 commits and 84 changed files (9,519 additions / 743 deletions). The Vercel Ready Preview bot comment still refers to the prior SHA `da77e82`; the latest SHA serving live requests and all Preview environment values remain unverified. CI #20 passed for the code candidate. A follow-up commit will update this sign-off only.

## PR scope and safe split recommendation

Reviewing `git diff origin/main...HEAD` shows substantial product/design work unrelated to the security objective: `src/components/portfolio-experience/**`, `docs/adm-optimization/PORTFOLIO_*.md`, the `public/logo-blue.png` replacement, admin/theme styling in `src/app/globals.css` and admin layout files, and the large generic cleanup inventory including `docs/cleanup/DEPENDENCY_GRAPH.json`. PR #3 now contains 84 changed files with 9,519 additions, including the 5,502-line generated dependency graph. Recommend splitting the portfolio/design/cleanup work into a separate PR; do not remove files or rewrite history without maintainer approval.

Keep security-relevant changes in scope, including auth/API controls, roles permission mapping and role-assignment checks, guarded local bootstrap, dependency audit evidence, and security docs. Recommend a separate portfolio/design/cleanup PR from `main`, with its own visual and content review. Do not remove files, rewrite history, or split the existing branch without maintainer approval; the current PR remains intact for review.

## Remaining release gates

| Gate | Status | Evidence needed to close |
| --- | --- | --- |
| Direct `staging_viewer` Users/Role API denial in Preview | **UNVERIFIED** | Browser-session direct API checks below; verify status 403 and no state change. |
| Super Admin API authorization in Preview | **UNVERIFIED** | Verify authorized reads and one approved disposable write through the API; remove only that disposable record. |
| Login/logout and server-side session revocation | **UNVERIFIED** | Live session test with a second in-memory browser context retaining the same pre-logout session. |
| Refresh rotation/replay | **UNVERIFIED** | Live dual-context test; the stale refresh state should be rejected while the rotated session remains valid. |
| Password reset and email verification | **UNVERIFIED** | Controlled inbox test for generic response, one-time use, expiry, and session revocation. |
| Redis-backed HTTP 429/shared counters | **UNVERIFIED** | Controlled Preview requests from separate clients against a dedicated disposable account. |
| Redis failure/timeout HTTP 503 | **BLOCKED** | No fault injection until an owner confirms exclusive staging Redis/deployment ownership and authorizes a disposable Preview fault test. |
| Media upload limits, content validation, and Blob access/lifecycle | **UNVERIFIED** | Staging checks for body/file boundaries, MIME/signature mismatch, SVG rejection, storage policy and edge limits. No uploads were sent. |
| Existing MongoDB media index state/migration | **UNVERIFIED** | Owner checks the `publicId` index on a staging/backup copy; source removed request-time DDL, but live index state was not inspected. |
| Public contact/consultation abuse controls | **UNVERIFIED** | Review distributed edge limits and bounded processing for public mutation routes. |
| Backup/restore, monitoring, incident ownership | **UNVERIFIED** | Owner supplies restore-drill evidence, alert ownership and incident contact. |
| Preview/Production MongoDB, Redis, and mail isolation | **UNVERIFIED** | Deployment owner read-only attestation using masked identifiers and environment scopes. |
| Vercel runtime/environment settings and deployed headers | **UNVERIFIED** | Owner confirms Node 22, production-mode cookie behavior, variable presence/scope, TLS and response headers. |
| Rollback prerequisites | **UNVERIFIED** | Record last-known-good deployment/SHA, rollback owner, runbook, and observation window. |
| Fresh CI for security code candidate | **PASSED** | Run #20 passed on `beb9127e6be3114dbe618c43c122539259c93afb`. A documentation-only sign-off commit follows this code SHA; require the PR checks on the final head before merge. |
| Independent security review | **BLOCKED** | No eligible independent reviewer was identifiable from the PR (all commits by the author, no prior reviews, no requested reviewers). Reviewer assignment and evidence are still required. |

No runtime gate is marked FAILED: they were not exercised. A missing result is not a pass.

## Concise Preview test checklist

### Preconditions

1. Confirm the target URL is the Preview deployment serving security code candidate SHA `beb9127e6be3114dbe618c43c122539259c93afb`.
2. Confirm the deployment uses an isolated staging database, Redis, and controlled mail sink before creating test records or sending mail. Stop if any resource identity is ambiguous.
3. Use disposable `staging_viewer` and Super Admin accounts. Sign in through the Preview UI. Never paste credentials, cookies, recovery links, or tokens into a terminal, ticket, or report.
4. Run the following probes only in that logged-in Preview browser's DevTools Console. They rely on same-origin browser cookies and print only labels and HTTP statuses; they do not read or print response bodies or cookies.

### Bounded unauthenticated smoke harness

Only after the owner has attested isolated Preview MongoDB/Redis and mail scope, run from a local interactive Node 22 terminal. The script has no credential/cookie inputs, contacts only the approved ADM Vercel Preview hostname shape, performs one unauthenticated status GET and at most nine invalid login attempts, never follows redirects, and prints statuses only. It writes only the expected Redis limiter counters; it does not mutate user or role data. It does not test Redis outage behavior.

```powershell
$env:ADM_PREVIEW_SECURITY_SMOKE = "1"
$env:ADM_PREVIEW_SECURITY_TARGET = Read-Host "Current exact ADM Preview origin from the Vercel Ready status"
try {
  npm run preview:security-smoke
} finally {
  Remove-Item Env:ADM_PREVIEW_SECURITY_SMOKE -ErrorAction SilentlyContinue
  Remove-Item Env:ADM_PREVIEW_SECURITY_TARGET -ErrorAction SilentlyContinue
}
```

The script then requires typing the exact origin and an explicit isolated-staging Redis confirmation. Expected: `GET /api/auth/me` returns 401 without a session; the first eight synthetic login attempts return 401 and the ninth returns 429. Any unexpected status stops the run. This does not prove cross-instance sharing or timeout behavior. The harness was not run in this review because isolation was not owner-attested and the Preview host was inaccessible through the available browsing tool.

### Direct API authorization

While signed in as `staging_viewer`, run:

```js
const randomId = () => crypto.randomUUID().replaceAll("-", "").slice(0, 24);
const userId = randomId();
const roleId = randomId();
const probe = async (label, path, method = "GET", body) => {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: body === undefined ? {} : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { label, status: response.status };
};
const results = [];
results.push(await probe("viewer GET users", "/api/users"));
results.push(await probe("viewer POST user", "/api/users", "POST", {}));
results.push(await probe("viewer PATCH user", `/api/users/${userId}`, "PATCH", {}));
results.push(await probe("viewer DELETE user", `/api/users/${userId}`, "DELETE"));
results.push(await probe("viewer GET roles", "/api/roles"));
results.push(await probe("viewer POST role", "/api/roles", "POST", {}));
results.push(await probe("viewer PATCH role", `/api/roles/${roleId}`, "PATCH", {}));
results.push(await probe("viewer DELETE role", `/api/roles/${roleId}`, "DELETE"));
results.push(await probe("viewer assign permissions", `/api/roles/permissions/${roleId}`, "PATCH", {}));
results.push(await probe("viewer change default role", `/api/roles/default/${roleId}`, "PATCH", {}));
console.table(results);
```

Expected: `GET /api/users` is 200; every other call is 403. The mutation probes use random IDs and empty bodies. Stop immediately if any mutation returns success; inspect Preview state before continuing.

While signed in as Super Admin, run read probes:

```js
const results = await Promise.all([
  fetch("/api/users", { credentials: "same-origin", cache: "no-store" }).then(r => ({ label: "admin GET users", status: r.status })),
  fetch("/api/roles", { credentials: "same-origin", cache: "no-store" }).then(r => ({ label: "admin GET roles", status: r.status })),
]);
console.table(results);
```

Expected: both are 200. For positive write authorization, use the Preview UI/API to create one clearly labeled disposable user and one disposable role only if the staging owner approves test writes. Verify creation succeeds, then delete only those disposable records. Never edit or delete existing roles/accounts as a test.

### Login, logout, and refresh replay

1. Sign in as a disposable account; `/api/auth/me` should return 200. Sign out through the Preview UI; `/api/auth/me` should then return 401.
2. To verify server revocation rather than cookie clearing alone, use an approved local browser automation harness with two contexts. Clone the session cookie jar in memory before logout; do not serialize, inspect, or log it. Verify context B authenticates before logout, sign out in A, then verify B's `/api/auth/me` rejects. Dispose both contexts.
3. For rotation, start from a fresh session and clone it in memory to contexts A and B. Refresh in A and expect success. Replay B's stale refresh state and expect rejection (normally 409); confirm A's rotated state still authenticates. Never print cookie values. Treat status codes as the evidence.

### Password reset and email verification

1. Request reset for a disposable account and an unknown address; compare generic response status/body shape without recording addresses. Confirm delivery only to the controlled inbox.
2. Complete reset once; verify the new password works, the prior password fails, the reset state cannot be replayed, and prior sessions are revoked. Use a separate reset request and wait at least 16 minutes to verify expiry. Do not copy reset URLs/tokens into logs.
3. Repeat for verification: resend for verified/unverified test fixtures and compare generic responses; consume one link once; verify replay fails. Use a separate link and wait at least 16 minutes to verify expiry. Keep links inside the controlled inbox/browser only.

### Redis 429 and 503

1. To verify the account limit, use a fresh disposable Preview account and split nine invalid login attempts across two independent Preview browser clients within 15 minutes. Expected: eight requests reach generic login failure and the ninth receives generic 429. Stop at the ninth attempt. Do not use an administrator account. Record only status and timestamp. An HTTP 429 proves the limit fired; corroborate distributed sharing with masked provider metrics if available, never raw keys.
2. **Do not test 503 by disrupting shared Redis.** It remains blocked until the deployment owner confirms that the Preview Redis and a disposable Preview deployment are exclusively staging resources and explicitly authorizes fault injection. If authorized, use a separate disposable Preview deployment with a staging-only invalid/unreachable Redis configuration; make one request, expect generic 503, restore the normal staging configuration, redeploy, and confirm recovery. Never apply this test to Production or a shared Redis database.

## Deployment-owner checklist

Owner attests **presence/scope and masked identity only**; do not send secret values or full URIs.

- **MongoDB:** confirm Preview and Production use separate approved clusters/projects and access scopes; Preview credentials cannot access Production; least-privilege access is in place. Code candidate `beb9127` now fails fast in Production if `MONGODB_DB` is absent instead of defaulting to `adm-website`; set it explicitly in both intended Vercel scopes. No Production setting was changed.
- **Redis:** confirm distinct Preview and Production Redis resources/databases, tokens, and HMAC secrets. Confirm required settings exist in the correct Vercel scopes: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AUTH_RATE_LIMIT_KEY_SECRET` (at least 32 UTF-8 bytes). Verify client-IP header behavior and the 1,500 ms timeout's cold/warm latency headroom.
- **Mail:** confirm Preview delivery is restricted to the controlled sink/test recipients and Production mail credentials/sender are scoped only to Production. Verify sender-domain/DNS and HTTPS reset/verification origins; capture no message URLs or tokens.
- **JWT/credentials:** confirm distinct strong JWT secrets and scoped credentials in each Vercel environment; attest presence/rotation state without exposing values. Do not change Production settings during this verification.
- **Media/storage:** confirm request/body limits at edge and app, Blob token scope, public/private policy, retention/lifecycle, and approved content handling. Check existing `publicId` index state on staging/backup and use a separately approved migration if changes are needed.
- **Vercel/runtime:** confirm the deployed SHA/alias, Node 22 runtime, `NODE_ENV=production`, environment-variable presence/scope without revealing values, secure cookies, TLS, and actual deployed security headers. Source now sets `Strict-Transport-Security: max-age=31536000` without `includeSubDomains` or `preload`; verify delivery at the edge. CSP remains absent because Next.js 16 nonce support requires request-time dynamic rendering and compatibility validation; do not ship an untested restrictive policy.
- **Operations:** confirm backups and a tested restore drill, monitoring/alert owners, incident contact, and response plan.
- **Rollback:** record last-known-good Production deployment/SHA, rollback owner, tested rollback procedure, alert/monitor owner, and observation window. This review did not inspect or change Production settings.

## Independent reviewer packet

**Status: BLOCKED / not requested.** The PR has no submitted reviews and no requested reviewer; no independent findings exist to record. Do not mark this gate complete until reviewer evidence is attached to the current SHA.

Suggested scope for the assigned reviewer:

- `src/lib/auth/require-auth.ts`, `src/lib/auth/permission-enforcement.test.ts`, `src/app/api/users/**`, and `src/app/api/roles/**`: server-side authorization ordering, role assignment's separate `ROLE_UPDATE` check, and Super Admin bypass.
- `src/services/auth/auth.service.ts`, `src/app/api/auth/**`, `src/lib/auth/auth-cookies.ts`: logout/revocation, refresh rotation/replay, reset/verification token single-use and expiry, and generic errors.
- `src/lib/security/auth-request-limit.ts`, `src/lib/security/same-origin.ts`, their tests, and `src/app/api/auth/reset-password/route.ts`: distributed limits, fail-closed behavior, timeout, Preview origin trust, CSRF, and reset-completion limiter ordering.
- `src/app/api/admin-route-auth.integration.test.ts`, `src/app/api/auth/csrf-route.integration.test.ts`, `src/services/auth/auth.service.test.ts`: direct route guard ordering, auth lifecycle fixtures, and no-write guarantees.
- `src/config/env.ts`, `src/config/env-validation.ts`, `.vercelignore`, `scripts/bootstrap-preview-admin.local.ts`, `scripts/security/preview-security-smoke.local.mjs`, `next.config.ts`: environment/database isolation, local-only script exclusion/guards, runtime configuration, and security headers.

Reviewer record to complete: reviewer identity/role; reviewed SHA; date; decision; findings with severity, file/line, exploit conditions and evidence; required fixes; verification SHA. Until filled with actual reviewer evidence, status stays BLOCKED.

## Findings and decision

- **Critical:** none found in this targeted review; this is not a complete security audit.
- **High:** live Preview auth/RBAC/rate-limit behavior, environment separation, mail routing, safe rollback/restore readiness, and independent review remain release blockers (all unverified or blocked above). Media upload and existing-index verification from the earlier findings register also remain open.
- **Medium:** the code candidate requires explicit Production `MONGODB_DB`, but deployed settings still need owner verification. Source sets host-only one-year HSTS; Vercel/edge header delivery is unverified. CSP remains absent pending a nonce-aware compatibility plan.
- **Low:** ESLint reports 76 warnings despite exit 0; these are not all security issues and were not broadly cleaned up.

**Final recommendation: NO-GO for merge and Production release.** CI run #20 passed for code SHA `beb9127e6be3114dbe618c43c122539259c93afb`. The latest Vercel Preview deployment for that SHA, live Preview auth/RBAC/rate-limit behavior, environment owner attestations, and independent review remain unverified or blocked. Keep PR #3 unmerged until those gates have evidence and resulting issues are resolved or explicitly accepted by the release owner. No Production setting or data was touched in this review.
