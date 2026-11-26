# ADM security release sign-off

**Review date:** 2026-11-26
**Repository:** `Anwar0904/adm-platform`
**Branch / PR:** `security/platform-hardening-review` / [#3](https://github.com/Anwar0904/adm-platform/pull/3)
**Reviewed code candidate:** `92e42a4e131ff5ec47b6201d10c94c7b2e1f1d6d`
**Decision:** **NO-GO for controlled merge**

This sign-off records repository, CI, and targeted local evidence only. No Production data or configuration was accessed or changed. This document contains no credentials, cookies, bearer tokens, reset links, or secret values. The recovery pages were left unchanged.

## Evidence and release gates

| Gate | Actual evidence | Status | Minimum remaining operator action |
| --- | --- | --- | --- |
| Candidate and PR state | GitHub PR #3 targets `main`; head SHA matches this candidate; open, draft, mergeable, not merged. GitHub reports 98 changed files, 21 commits, 10,334 additions and 1,757 deletions. | PASS (state only) | Keep draft until all release gates below close. |
| GitHub quality checks | Quality run `45762659803` on this SHA: TypeScript/unit tests, ESLint, dependency advisory audit, and Production build all completed successfully. | PASS | None for this run; require fresh green checks after the sign-off commit. |
| Vercel deployment association | GitHub reports the Vercel status as `success` for this SHA. This establishes deployment status only, not environment isolation or runtime behavior. | PASS (deployment only) | Owner confirms serving SHA and runtime/environment scopes. |
| Preview page/API access | The Vercel Preview URL from the PR deployment comment could not be opened with the available browser connector. No authenticated browser fixture was available. | BLOCKED | Authorized operator opens the exact Preview deployment and records sanitized evidence. |
| Local checks on this SHA | On Node 22.23.5: typecheck passed; lint exited 0 with 76 warnings; tests passed 125, failed 0, skipped 1; production build passed. The skipped test requires a dedicated isolated Upstash fixture. Tests were run before this documentation-only update. | PASS (local only) | No rerun needed unless code changes. |
| Unconfigured recovery email behavior | Targeted local handler probe explicitly removed the four email-provider settings. Forgot-password and resend-verification each returned generic HTTP 503 with `no-store`; the test address was absent from both responses. No email was sent. | PASS (local fail-closed path only) | Owner confirms Preview provider-variable presence/scope; do not send recovery mail outside an approved sink. |
| Recovery reset and session revocation | Source review confirms a successful reset consumes the token, changes the password, then calls `SessionRepository.revokeAllUserSessions(userId)`. Existing local service tests cover valid reset and session revocation. No Preview reset or database mutation was performed. | BLOCKED (live proof) | Use the isolated Preview procedure below and verify stale sessions return 401. |
| API write authorization | Local route tests cover mocked permission denials and Super Admin behavior. No live Preview POST/PATCH/DELETE request or persisted-write test was run. | BLOCKED (live proof) | Use disposable Preview accounts and records; verify each denied write preserves state. |
| Logout and server-side session revocation | Local tests cover current-token logout and stale-token rejection. No live authenticated Preview session was available. | BLOCKED (live proof) | Verify logout in one isolated browser context invalidates the same session in another. |
| Refresh rotation and replay | Local tests cover rotation, concurrent conflict, and stale-token rejection. No live Preview session was available. | BLOCKED (live proof) | Verify old refresh replay fails while the rotated session remains valid; record status codes only. |
| Cross-origin and CSRF | Local route/same-origin tests cover cookie mutation rejection. No live authenticated Preview mutation was run. | BLOCKED (live proof) | Make one cross-site mutation request with a disposable Preview session; confirm rejection and no state change. |
| Redis-backed 429 | Local limiter tests pass; the dedicated Upstash integration test is skipped because no isolated fixture was configured. No Preview burst was run. | BLOCKED | Owner confirms Preview Redis isolation and variable presence; then run the bounded Preview limiter harness and retain status codes only. |
| Redis failure behavior | No exclusive disposable Preview Redis, fault-test authorization, recovery owner, or test window is recorded. No fault injection was run. | BLOCKED | Owner completes all four authorizations in `DEPLOYMENT_OWNER_ATTESTATION.md`; use a separate disposable deployment, bounded failure probe, restore, and recovery check. |
| MongoDB isolation and access | The owner attestation has no completed evidence for Preview/Production cluster or database separation, explicit Preview `MONGODB_DB`, least privilege, or Preview credential inability to access Production. | BLOCKED (owner evidence) | Owner supplies masked cluster/project/database identities and confirms isolation and least privilege. |
| Redis isolation and trusted client IP | No owner evidence establishes separate Preview/Production Redis resources, separately scoped token/HMAC settings, Preview variable presence, or trusted edge IP-header behavior. | BLOCKED (owner evidence) | Owner supplies masked resource identities and confirms scope and trusted-header behavior; no key/token values. |
| Mail isolation | No owner evidence establishes a Preview-only sink/test-recipient restriction or Production-only provider/sender scope, verified sender domain, or DNS state. | BLOCKED (owner evidence) | Owner confirms Preview sink restrictions and Production sender/provider scope using masked evidence. |
| Node runtime and Vercel environment scopes | CI used Node 22 and local Node was 22.23.5. Neither proves deployed Node 22, `NODE_ENV=production`, or correct Preview/Production variable scopes. | BLOCKED (owner evidence) | Owner confirms runtime and environment scopes for Preview and Production (presence/scope only). |
| Cookies and response headers | Source config/tests cover cookie options and configured security headers. No deployed auth response or header probe was obtained; no `Set-Cookie` values were recorded. CSP remains an explicit compatibility decision, not a verified control. | BLOCKED (deployed evidence) | Owner supplies sanitized HTTPS/header evidence for HSTS, CSP decision, and Secure/HttpOnly/SameSite attributes. Never include cookie values. |
| Backups, monitoring, and rollback | No owner-supplied restore drill, monitoring/alert owner, incident contact, last-known-good Production SHA/deployment, rollback owner/runbook, or observation window is recorded. | BLOCKED (owner evidence) | Owner records these items and references sanitized evidence. |
| PR scope | The PR includes security/auth/session/authorization work and unrelated portfolio/design/QA documentation, generated cleanup inventory (5,502-line dependency graph), logo, global/admin UI changes. | REVIEW REQUIRED | Maintainer decides whether to keep scope or authorize a separate PR. Do not rewrite, remove, or cherry-pick PR files without that authorization. |
| Independent review | GitHub reports zero submitted reviews and no requested reviewers. | BLOCKED | Assign an eligible independent reviewer to the final SHA; record findings and decision. No self-approval. |
| Other open security findings | Existing media upload/body/MIME/Blob lifecycle limits, Mongo `publicId` index state, and distributed abuse controls for public contact/consultation remain unverified. | BLOCKED / UNVERIFIED | Security owner dispositions each with staging/backup evidence or explicitly accepts documented residual risk. |

## Exposed-session invalidation procedure

No session or database mutation was executed. The code has user-scoped revocation through the successful password-reset flow and `SessionRepository.revokeAllUserSessions(userId)`; authenticated password change also revokes all active sessions for that user. The forgot-password endpoint deliberately fails closed when mail is not configured, so do not assume a usable reset email exists in Preview.

The authorized staging operator must:

1. Identify the affected ADM account and exact Vercel Preview deployment. Confirm the Preview MongoDB cluster and explicit `MONGODB_DB` are isolated from Production, and that the operator is authorized to revoke this account's Preview sessions. Do not provide account addresses, database URIs, or secrets in this sign-off.
2. If a controlled Preview recovery sink is configured, use its one-time reset flow. Otherwise, after explicit owner authorization, invoke the existing user-scoped `SessionRepository.revokeAllUserSessions(confirmedPreviewUserId)` against the confirmed Preview database only. Capture the affected count, not identifiers or tokens. Do not run this against an unverified or Production database.
3. In separate controlled browser contexts, verify the affected account's old `/api/auth/me` and `/api/auth/refresh` requests return 401. Confirm a fresh authorized login works. Record only status codes and sanitized timestamps.
4. Separately revoke exposed Vercel Deployment Protection access/shared links in Project Settings, where applicable. Confirm the old protected browser is denied and a newly authorized operator can enter Preview. Do not disable/re-enable protection as a substitute for revocation.

## PR scope handling

Do not separate the 98-file scope without maintainer authorization. The current diff includes unrelated portfolio experience and design/release documentation, cleanup inventory, a logo replacement, and broad global/admin UI changes alongside security work. Preserve PR #3 unchanged and draft until the maintainer chooses either to review the mixed scope or authorize a separate branch/PR for unrelated work. Do not rewrite history or remove valid changes.

## Final decision

**NO-GO.** Code and CI evidence are favorable, but exposed-session invalidation, live Preview behavior, owner-controlled environment evidence, disposition of open findings/scope, and independent review are still outstanding. This sign-off is not an owner attestation, risk acceptance, or merge authorization.
