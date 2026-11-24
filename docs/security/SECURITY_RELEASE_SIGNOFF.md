# ADM security release signoff

**Review date:** 2026-11-24

**Branch:** `security/platform-hardening-review`

**Candidate commit:** `d372c705f2f585a11468c2dbd65700c3bf28b3a9`

**Pull request:** [#3](https://github.com/Anwar0904/adm-platform/pull/3)

**Decision:** **NO-GO for merge and Production release.** Keep PR #3 unmerged and draft. Several staging and ownership gates remain unverified.

## 1. Vulnerability and remediation

The former authentication limiter stored counters in a JavaScript `Map` inside one Vercel function process. Counters were not shared between independently scaled or cold-started instances, so distributing attempts could bypass route budgets.

The candidate uses `@upstash/redis` and one Redis Lua script to inspect and update account/IP counters atomically. Per-route budgets and first-request fixed-window expiry remain unchanged:

| Endpoint | Per-account | Per-IP | Window |
| --- | ---: | ---: | --- |
| Login | 8 | 30 | 15 minutes |
| Registration | 3 | 10 | 1 hour |
| Password reset | 3 | 15 | 15 minutes |
| Verification resend | 3 | 15 | 1 hour |

Limiter keys use a route namespace and HMAC digests, not raw account identifiers, IP addresses, passwords, JWTs, or recovery tokens. Production uses Vercel's overwritten `x-forwarded-for` header and does not accept an environment-selected client-IP header. Redis errors and timeouts fail closed with a generic 503; limit exhaustion returns the existing generic 429. Production has no in-memory fallback. SDK and provider references: [Upstash TypeScript SDK](https://upstash.com/docs/redis/sdks/ts/overview), [Redis EVAL/Lua](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval), [Vercel request headers](https://vercel.com/docs/headers/request-headers).

## 2. Verification evidence

### Source and automated evidence

- The local branch is `security/platform-hardening-review` at `d372c705f2f585a11468c2dbd65700c3bf28b3a9`, matching the current PR #3 head reported by GitHub. The PR remains open and draft, unmerged, with no submitted reviews and no requested reviewers.
- As checked on **2026-11-24**, GitHub Actions quality run **#12** completed successfully for this head. All four jobs passed: Dependency advisory audit (`npm audit --audit-level=high`), ESLint, TypeScript and unit tests, and Production build plus static SEO smoke check. Each workflow job uses `.nvmrc`; `.nvmrc` contains `22`, and `package.json` requires `>=22 <23`. This verifies the CI runtime selection, not the configured Vercel Production runtime.
- GitHub reports a successful Vercel commit status for this SHA. The PR's Vercel bot comment identifies Preview URL `https://adm-platform-git-security-platform-h-78cfd5-anwar0904s-projects.vercel.app`. This proves the status/URL GitHub associates with the commit, not its live runtime configuration or isolation.
- CI source-level session tests passed: logout revokes by signed session ID after refresh-token rotation; stale refresh replay returns 409 without revoking the active session; and concurrent refresh rotation has one winner and one 409 loser. These are mocked/unit tests, not a deployed logout/replay test.
- CI source-level limiter tests passed for configured thresholds, generic 429 response, atomic in-memory behavior, generic 503 on store errors, and no Production in-memory fallback. These do not confirm shared Redis behavior or actual HTTP 429/503 responses in Preview.
- The operator reports that Preview login succeeds and `/admin/dashboard` opens. This is recorded as operator-provided evidence, not independently reproduced in this session.
- Direct unauthenticated HEAD probes of `/`, `/admin/dashboard`, `/api/auth/me`, `/api/users`, and `/api/test-db` from this workspace failed to establish TLS (`curl` exit 7, HTTP status `000`). No response was received, so no route status, response header, or runtime behavior is inferred from those probes.
- The operator-reported real Redis integration run on 2026-11-22 remains: **1 passed, 0 failed, 0 skipped; 6,360 ms total**, with two Upstash clients testing shared counters and expiry. It was not rerun here and does not provide per-request p95/p99, validate the deployed function path, or measure the 1,500 ms production timeout.

### Preview and Production configuration evidence

The GitHub Vercel status and bot comment provide a Preview URL for the candidate SHA. However, this workspace cannot reach that host and has no Vercel project settings/runtime inspection connector. The operator reports that login and the dashboard work in Preview, but the deployed SHA/alias, Preview environment-variable presence/scope, function region, MongoDB isolation, mail routing, and Preview-to-Production separation could not be independently confirmed. No secret values were read, printed, or changed. A Ready Vercel status does not prove configuration correctness.

Production settings were not inspected or modified. Local environment files do not establish Vercel environment scope.

The limiter requires server-side `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AUTH_RATE_LIMIT_KEY_SECRET` (minimum 32 UTF-8 bytes). Do not prefix these with `NEXT_PUBLIC_`. Preview and Production must use separate Redis databases, access tokens, and HMAC secrets. Presence, environment scope, and connectivity remain unverified here.

## 3. Production timeout operational assessment

The current Production limiter uses a 1,500 ms abort timeout for each Upstash HTTP request. The Upstash Node client passes the configured `AbortSignal` to `fetch`; the deadline therefore bounds the Redis HTTP operation, not the whole Vercel invocation. Vercel cold-start and application initialization time before the Redis fetch still adds to the user's end-to-end response time. The first Redis request from a cold instance may also pay DNS/TLS/connection setup; the client enables keep-alive, which can help on reused instances.

Vercel documents that Node functions normally execute in `iad1` unless configured, and recommends placing compute near its data source. Vercel can scale functions down to zero, then reuse or start instances as demand changes ([function lifecycle](https://vercel.com/docs/functions), [regions](https://vercel.com/docs/functions/configuring-functions/region)). Upstash regional writes are handled at the primary region. This limiter's Lua script writes counters, so a Redis primary far from the Vercel function region can add cross-region round-trip latency; read replicas in an Upstash Global database do not remove the primary write path ([Upstash Global database](https://upstash.com/docs/redis/features/globaldatabase)). Actual Preview function region and Redis primary region were not available to inspect.

If the Redis operation exceeds 1.5 seconds or errors, these limited authentication endpoints fail closed with HTTP 503 and the generic message `Authentication is temporarily unavailable.` Login, registration when enabled, password-reset initiation, and verification resend are then unavailable for that request. The request is not allowed through without the limiter. This is a deliberate security-versus-availability choice, but repeated slow calls can prevent users from logging in or recovering accounts.

**Suitability conclusion:** 1.5 seconds may be adequate when Vercel compute and the Redis primary are close and measured tail latency has headroom, but it is not verified for this deployment. The operator-reported 6,360 ms is the duration of the complete concurrent integration test, including its expiry wait; it does not give per-request p95/p99 latency and cannot validate a 1.5-second deadline. Do not increase or otherwise change the Production timeout based on this test alone. Before release, measure the deployed Preview limiter from warm and cold function instances, including first-request connection setup and expected concurrency. Record p50/p95/p99 and timeout/error counts, correlate function region with Redis primary, and agree an availability target. Keep the current value only if the observed tail has comfortable margin below 1.5 seconds; otherwise adjust region/provider placement first, then review a timeout change with a fresh test and CI. No Production timeout change was made.

## 4. Controlled Preview authentication procedure

This procedure is partially pending. The operator reports successful Preview login and dashboard access, but logout/revocation, refresh replay, reset, email verification, RBAC, rate-limit exhaustion, and Redis timeout behavior have not been verified end to end. The direct probes in this review could not connect to the Preview host. Continue only against an owner-attested Preview deployment with isolated database and mail sink, using disposable accounts and controlled inboxes. Do not use customer accounts or Production data. Capture only status codes, redacted response fields, timestamps, request IDs, and function-region evidence. Never capture passwords, cookies, bearer/recovery/verification tokens, full HAR files, raw Redis keys, or secret values.

### Preflight

1. Read-only confirm the Preview URL and deployment SHA from Vercel. GitHub currently associates the Ready Preview URL above with candidate `d372c705`; the serving deployment and its alias still need confirmation by the deployment owner.
2. In read-only settings, confirm `NODE_ENV=production` behavior and presence/scope (not values) of `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AUTH_RATE_LIMIT_KEY_SECRET`. Confirm Preview uses its own Redis database, token, and independent HMAC secret, and Production is a separate scope.
3. Confirm Preview MongoDB cluster/database, mail provider/sink, callback origin, and allowed origins are distinct from Production. Stop if any target is ambiguous. Do not copy connection strings or credentials into notes.
4. Prepare separate fixtures: active standard user, unverified user, read-only user, a role with `USER_CREATE` but without `ROLE_UPDATE`, and an admin fixture. Use disposable Preview identities and a controlled inbox. Ensure a Preview owner can restore any test-only role/account state without using destructive endpoints.
5. Establish the function region and Redis primary region using deployment/provider metadata. Record masked configuration presence and regions, never secret values. Start with warm requests, then repeat after an idle interval to capture a cold/first request. Do not induce load against Production.

### Authentication flows and access boundaries

1. **Login:** In a clean browser profile, valid credentials should return 200, an allowlisted user DTO, and HttpOnly session cookies with Secure and SameSite=Lax in production-mode Preview. Wrong-password and unknown-account cases should have matching 401 status/body shape. Use a separate disposable account for later throttling so failed attempts do not interfere with successful-flow checks. Submit a cookie-based mutation with a hostile Origin and expect 403.
2. **Logout:** Log in once, then copy that same session cookie jar in memory into two isolated browser contexts. Call `/api/auth/me`, then POST `/api/auth/logout` in context A. Verify cookies are cleared there; replay context B's copy of the same pre-logout session to `/api/auth/me` and `/api/auth/refresh` and expect rejection. Never print cookie contents. Do not log in independently in each context, because that creates separate sessions.
3. **Refresh rotation:** Sign in with a fresh session. POST `/api/auth/refresh` with a valid later `activityAt`; expect success and updated cookies. Replay the old refresh state from the second context and expect 409; confirm the new session still authenticates. Verify expired access renewal only with a Preview-only short TTL if required, then restore the standard Preview TTL.
4. **Password recovery:** Request reset for a known test account and an unknown address; expect the same generic 202 response with no token. Only the controlled inbox should receive a message. Verify the client receives the token through the link fragment and removes the fragment before its API request. Complete one reset; verify the new password succeeds, the old password fails, sessions are revoked, and token replay returns 400. For expiry, use a separate test token, wait 16 minutes (token lifetime is 15 minutes), and expect rejection with no password change.
5. **Email verification:** Request resend for the unverified test account and an unknown address; compare generic status/body and confirm delivery only to the controlled inbox. Verify one token once; replay must return 400. Use a separate fixture/token for expiry, wait 16 minutes, and confirm rejection while the account remains unverified. No token should appear in API responses or logs.
6. **Role permissions:** With no cookies, request representative protected APIs `/api/users`, `/api/roles`, `/api/media`, and `/api/settings`; expect 401/403 and no protected data. Repeat read/write cases with the read-only user and expect writes denied. With the `USER_CREATE`-without-`ROLE_UPDATE` role, attempt to assign a role to a disposable Preview user; expect 403 and unchanged state. Verify admin actions match assigned permissions. Do not invoke seed, delete, restore, or other destructive operations.
7. **Restricted routes:** After confirming Preview runs production mode, GET `/api/test-db` and send an unauthenticated POST to `/api/seed/roles`; both should return 404 before diagnostics or seed/database work. Check errors/logs for no token, cookie, credential, raw exception, database detail, or provider response body.

### Shared Redis limiter and latency

1. Use a fresh disposable account and two independent Preview runners. Coordinate nine invalid login attempts in a near-simultaneous batch inside 15 minutes (four from runner A, five from B). The first eight should reach credential verification and the excess request should receive generic 429. Confirm the account counter is shared using an approved provider metric or a masked counter count; do not reveal raw key or identifier. Record Vercel request IDs and function regions where available; a matching region alone does not prove separate function instances.
2. Send four password-reset requests in 15 minutes to a controlled mailbox; the account budget is three and excess request(s) should receive 429. Stop after the limit; do not generate repeated email. For IP behavior, use the real proxy-provided client IP and confirm arbitrary client-provided forwarding headers do not change the trusted bucket.
3. Repeat warm and after-idle requests while recording only response status and elapsed time. Include enough samples to assess p95/p99 and timeout/error rates under expected Preview concurrency. Compare Vercel function region with the Upstash primary region. Do not treat the standalone 10-second integration-test timeout as an operational target.
4. If Redis is slow/unavailable, confirm the limited authentication request returns generic 503, does not continue to credential or recovery processing, and does not disclose provider details. Record the event and stop if repeated failures make the Preview flow unavailable.
5. Close out with deployed SHA, Preview alias, test date, account fixture labels (not addresses), mail sink result, sanitized status shapes, latency percentiles, timeout count, function/primary regions, and masked config attestations. Preserve fixtures for owner review; do not clean up by deleting records or touch Production.

## 5. Remaining vulnerabilities and release blockers

- No new Critical source vulnerability was identified in this targeted review. Previously reviewed recovery-token disclosure and password-change identity fixes still need deployed behavior confirmation.
- Operator-reported Preview login/dashboard success does not cover logout revocation, refresh-token rotation/replay, password reset, email verification, RBAC or protected API boundaries. Dedicated test accounts and a controlled inbox were not provided to this validation session; no requests were sent to those flows.
- The distributed limiter is implemented, and prior operator-reported two-client Redis integration covers shared counter behavior and expiry. The deployed Vercel authentication path, Preview cross-instance outcome, actual HTTP 429 threshold behavior, and Redis failure/timeout HTTP 503 behavior remain unverified end to end. CI's 429/503 tests are unit-level only.
- The 1.5-second Production timeout has no measured Preview cold/warm latency evidence. Slow or unavailable Redis intentionally makes limited auth flows return 503. Function region, Redis primary placement, and tail latency must be verified before accepting this availability risk.
- The CI workflow selects Node 22, but the actual Production runtime version and rollback target/deployment ID, rollback owner, and observation window have not been attested.
- GitHub's Vercel status is successful for candidate `d372c705`, and the bot reports a Preview URL, but the Preview host was unreachable from this workspace and runtime configuration cannot be inspected. Preview/Production environment separation, database/mail isolation, and required Redis variable presence/scope remain unverified.
- Password reset/email verification delivery and replay/expiry behavior, deployed RBAC, protected API denials, and restricted-route behavior remain unverified. Upload integration, deployed security headers/TLS, database least privilege, storage policy, backup/restore, and other wider release gates remain outside this targeted validation.
- No independent PR review has been submitted. This session could not identify a reviewer handle/team from the PR metadata. A request was attempted as a PR comment, but GitHub rejected comment creation with HTTP 403 (`Resource not accessible by integration`); an independent review remains unrequested until an authorized repository reviewer is assigned.

## 6. Production prerequisites, rollout, and rollback

Before any release, an authorized owner must attest **presence and scope only**, without sharing values:

- Production-only `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AUTH_RATE_LIMIT_KEY_SECRET` with a dedicated Production Redis database and independent secret of at least 32 UTF-8 bytes; Preview has separate credentials/database/secret.
- Production `NODE_ENV`; public signup disabled unless explicitly approved.
- Production `MONGODB_URI` and `MONGODB_DB` identify the approved database and differ from Preview; confirm by masked identifiers or owner attestation.
- Strong, distinct Production `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- If email is enabled, Production provider, key, sender, HTTPS base URL, and allowed origins are correctly scoped; Preview delivery goes only to the controlled test sink.
- The Vercel edge overwrites the trusted Production client-IP header. Record Production function region, Redis primary region, cold/warm latency percentiles, 503 rate, and the accepted timeout headroom.
- TLS/headers, database and storage access policy, backup/restore, alerting, incident owner, rollback target, and post-deployment monitoring are verified under the wider release gates.

For an approved rollout, record the last known-good deployment/SHA, candidate SHA, deployment ID, rollback owner, and observation window. Deploy only through the approved release process. Monitor auth 401/403/429/503 rates, Redis latency/timeouts/errors, refresh conflicts, mail failures, database errors, and user reports. If Redis latency causes repeated 503s or limits fail, stop rollout and restore the last known-good deployment/configuration; keep the limiter fail-closed until the cause is understood. Recheck auth/session behavior after rollback. No Production configuration or timeout was changed for this review.

## 7. Release decision

**NO-GO for merge and Production release.** CI run #12 and Vercel status are successful for `d372c705`; the operator reports Preview login/dashboard success; and mocked session/limiter unit tests passed in CI. Remaining blockers are independent review, owner attestation of Preview and Production separation/readiness, deployed logout/rotation/recovery/verification/RBAC/rate-limit/Redis-503 validation, and measured warm/cold latency and timeout behavior for the unchanged 1.5-second Production deadline. The 6,360 ms integration-suite duration is not per-request latency evidence. Keep PR #3 unmerged and draft until evidence is attached to this candidate. No Production user data, Production configuration, deployment, merge, PR state, or credentials were accessed or changed in this review.
