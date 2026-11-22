# ADM security release signoff

**Review date:** 2026-11-22

**Branch:** `security/platform-hardening-review`

**Candidate commit:** `c596d6878b06d1b2dd2094f21f0db43d07821e66`

**Pull request:** [#3](https://github.com/Anwar0904/adm-platform/pull/3)

**Decision:** **NO-GO for merge and Production release.** Keep PR #3 unmerged; do not mark it Ready for Review pending the gates below.

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

- The local branch and its configured upstream both point to `c596d6878b06d1b2dd2094f21f0db43d07821e66`. GitHub commit metadata confirms that commit changes only the two integration-test client timeouts from 1.5 seconds to 10 seconds. The Production limiter's `REDIS_TIMEOUT_MS` remains 1,500 ms.
- GitHub Actions run 10 for this commit completed successfully. The Dependency advisory audit, Production build, TypeScript/unit tests, and ESLint jobs all report success.
- GitHub reports a successful Vercel commit status attached to this SHA. The deployment detail URL could not be opened from this workspace, so this verifies the status associated with the SHA, not the runtime alias or environment-variable scopes serving Preview.
- The operator reported a real Redis integration run on 2026-11-22: **1 passed, 0 failed, 0 skipped; 6,360 ms total**. It used two separate Upstash Redis clients and exercised concurrent shared-counter enforcement and expiry with a 10-second timeout on both test clients. This is recorded as operator-provided evidence; the run was not repeated in this review session. It demonstrates the tested Redis store behavior under those conditions, not production latency or the full Vercel authentication path.

### Preview and Production configuration evidence

No Vercel CLI or linked `.vercel/project.json` is available here, and no Vercel settings connector is available. The Vercel dashboard deployment URL is inaccessible to this review. Therefore the deployed Preview SHA/alias, Preview environment-variable presence and scope, function region, Preview MongoDB isolation, mail routing, and Preview-to-Production separation could not be independently confirmed. No secret values were read, printed, or changed. The successful Vercel status is not evidence of configuration correctness.

Production settings were not inspected or modified. Local environment files do not establish Vercel environment scope.

The limiter requires server-side `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AUTH_RATE_LIMIT_KEY_SECRET` (minimum 32 UTF-8 bytes). Do not prefix these with `NEXT_PUBLIC_`. Preview and Production must use separate Redis databases, access tokens, and HMAC secrets. Presence, environment scope, and connectivity remain unverified here.

## 3. Production timeout operational assessment

The current Production limiter uses a 1,500 ms abort timeout for each Upstash HTTP request. The Upstash Node client passes the configured `AbortSignal` to `fetch`; the deadline therefore bounds the Redis HTTP operation, not the whole Vercel invocation. Vercel cold-start and application initialization time before the Redis fetch still adds to the user's end-to-end response time. The first Redis request from a cold instance may also pay DNS/TLS/connection setup; the client enables keep-alive, which can help on reused instances.

Vercel documents that Node functions normally execute in `iad1` unless configured, and recommends placing compute near its data source. Vercel can scale functions down to zero, then reuse or start instances as demand changes ([function lifecycle](https://vercel.com/docs/functions), [regions](https://vercel.com/docs/functions/configuring-functions/region)). Upstash regional writes are handled at the primary region. This limiter's Lua script writes counters, so a Redis primary far from the Vercel function region can add cross-region round-trip latency; read replicas in an Upstash Global database do not remove the primary write path ([Upstash Global database](https://upstash.com/docs/redis/features/globaldatabase)). Actual Preview function region and Redis primary region were not available to inspect.

If the Redis operation exceeds 1.5 seconds or errors, these limited authentication endpoints fail closed with HTTP 503 and the generic message `Authentication is temporarily unavailable.` Login, registration when enabled, password-reset initiation, and verification resend are then unavailable for that request. The request is not allowed through without the limiter. This is a deliberate security-versus-availability choice, but repeated slow calls can prevent users from logging in or recovering accounts.

**Suitability conclusion:** 1.5 seconds may be adequate when Vercel compute and the Redis primary are close and measured tail latency has headroom, but it is not verified for this deployment. The operator-reported 6,360 ms is the duration of the complete concurrent integration test, including its expiry wait; it does not give per-request p95/p99 latency and cannot validate a 1.5-second deadline. Do not increase or otherwise change the Production timeout based on this test alone. Before release, measure the deployed Preview limiter from warm and cold function instances, including first-request connection setup and expected concurrency. Record p50/p95/p99 and timeout/error counts, correlate function region with Redis primary, and agree an availability target. Keep the current value only if the observed tail has comfortable margin below 1.5 seconds; otherwise adjust region/provider placement first, then review a timeout change with a fresh test and CI. No Production timeout change was made.

## 4. Controlled Preview authentication procedure

This procedure is pending. No end-to-end authentication or RBAC behavior is claimed as verified. Run only after an owner confirms the target is Preview, its database and mail sink are isolated from Production, and the deployed SHA is the reviewed candidate. Use pre-provisioned disposable accounts and controlled inboxes; do not use customer accounts or Production data. Capture only status codes, redacted response fields, timestamps, request IDs, and function-region evidence. Never capture passwords, cookies, bearer/recovery/verification tokens, full HAR files, raw Redis keys, or secret values.

### Preflight

1. Read-only confirm the Preview URL and deployment SHA from Vercel, and confirm the serving deployment is the reviewed candidate. The current GitHub-linked Vercel success is attached to `c596d687`; the exact Preview alias remains to be attested by the deployment owner.
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
- The distributed limiter is implemented, and the operator-reported real Redis test verifies atomic shared counters and expiry across two clients. The deployed Vercel authentication path, Preview cross-instance outcome, and Redis failure-to-503 behavior remain unverified end to end.
- The 1.5-second Production timeout has no measured Preview cold/warm latency evidence. Slow or unavailable Redis intentionally makes limited auth flows return 503. Function region, Redis primary placement, and tail latency must be verified before accepting this availability risk.
- The Vercel status is successful for candidate commit `c596d687`, but the deployed Preview alias and environment configuration cannot be inspected from this workspace. Preview/Production environment separation, database/mail isolation, and required Redis variable presence/scope are not independently verified.
- The full Preview login/logout/refresh/recovery/verification/RBAC/restricted-route procedure above remains unperformed. Upload integration, deployed security headers/TLS, database least privilege, storage policy, backup/restore, and other wider release gates also remain outside this targeted verification.

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

**NO-GO for merge and Production release.** The real two-client Redis integration pass is meaningful evidence for the shared atomic store, and CI plus Vercel report success for `c596d687`. Remaining blockers are deployed Preview/configuration attestation, end-to-end Preview authentication and RBAC tests, and measured cold/warm latency and timeout behavior for the unchanged 1.5-second Production deadline. The provided integration test's 6,360 ms total is not per-request latency evidence. Do not mark PR #3 Ready for Review until these gates are recorded against the reviewed deployment. No PR state change, merge, Production deployment, credential change, or Production timeout change was performed.
