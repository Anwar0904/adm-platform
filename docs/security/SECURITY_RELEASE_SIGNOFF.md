# ADM security release sign-off

**Review date:** 2026-11-25 | **Branch:** `security/platform-hardening-review` | **PR:** [#3](https://github.com/Anwar0904/adm-platform/pull/3)

**Candidate:** `956c1e832a25ccf859caa8467a482a2ffdc5608c`
**Decision:** **NO-GO for merge or Production release**

Statuses distinguish evidence collected by automation from evidence reported by the operator. No Production data or settings were accessed or changed. No secrets, cookies, credentials, message links, or tokens were requested or recorded.

## Current evidence

| Gate | Status | Evidence |
| --- | --- | --- |
| Local/remote branch synchronization | **PASSED** | Local `HEAD`, `origin/security/platform-hardening-review`, and GitHub PR head all equal `956c1e832a25ccf859caa8467a482a2ffdc5608c`; worktree was clean before this documentation update. |
| PR CI | **PASSED** | GitHub run `45667020984`: TypeScript/unit tests, ESLint, Production build, dependency audit, and Vercel Preview Comments all completed successfully for the candidate SHA. |
| Vercel deployment association | **PASSED (deployment only)** | GitHub Vercel commit status for the candidate is `success` / “Deployment has completed” (deployment record `EKLy8iVWYizjBBcHv8gsCj66UEH9`). This does not attest environment isolation or authenticated runtime behavior. |
| Preview `staging_viewer` navigation and Users access | **PASSED (operator-reported)** | Operator reports unauthorized links hidden and permitted Users page working. No raw credentials or session data were used here. |
| Preview protected API denials | **PASSED (operator-reported, limited scope)** | Operator reports multiple protected APIs returned HTTP 403. Endpoint list and sanitized response artifacts were not supplied; do not extend this result to unlisted routes or write methods. |
| Local checks on candidate | **PASSED** | Node 22 `typecheck` passed; full ESLint exited 0 with 76 warnings; full test suite: 125 passed, 0 failed, 1 skipped (dedicated isolated Upstash fixture absent); Preview smoke policy tests: 3/3 passed; production build completed. These are local/CI checks, not proof of deployed behavior. |
| PR scope | **REVIEW REQUIRED** | PR is open/draft, 18 commits, 96 files, and mergeable. It includes unrelated portfolio/design and cleanup changes; separation plan below. |

## Remaining release gates

| Gate | Status | Exact evidence/action to close |
| --- | --- | --- |
| Exposed ADM staging sessions | **BLOCKED** | Code inspection confirms a successful password reset calls `SessionRepository.revokeAllUserSessions(userId)`, marking all active session documents for that user revoked; both authenticated access and refresh require an active session. No reset or database mutation was executed: the exact disposable staging account and exclusive Preview database ownership are unconfirmed, and no controlled inbox/session fixture is available. Owner must reset that account through Preview recovery, then verify stale `/api/auth/me` and `/api/auth/refresh` requests return 401 using an isolated browser context; record statuses only. If reset succeeds but revocation fails, use the same targeted repository operation only after confirming Preview database/account identity and ownership. |
| Exposed Vercel Preview protection session | **BLOCKED** | This Deployment Protection cookie is separate from ADM cookies. No Vercel access change was executed. Owner must revoke the exposed users granted/shareable deployment access in Project Settings -> Deployment Protection -> Access, including any shared link; for team/project members, remove or suspend that access as appropriate. Confirm the old browser is denied while a newly authorized operator can still access Preview. Do not disable/re-enable protection to revoke it: Vercel documents that previously authenticated users may retain access through an existing deployment-scoped cookie. |
| Logout and server-side revocation; stale refresh replay | **BLOCKED** | No authenticated browser/session fixture is available here. On Preview, use two in-memory browser contexts: verify both initially authenticate, logout in A, then require B to get 401; separately rotate in A and require stale B replay to fail while A remains valid. Record statuses only. |
| Password recovery and email verification | **BLOCKED** | Controlled inbox and disposable identities are not available here. Owner must confirm Preview mail sink/isolation, then test generic responses, single use, expiry and reset-driven session revocation using disposable accounts. Keep links inside the controlled inbox/browser. |
| Live Redis-backed 429 | **BLOCKED** | The guarded harness requires explicit confirmation of an isolated Preview Redis, which the owner attestation does not contain. Owner must complete the Redis isolation/presence rows in `DEPLOYMENT_OWNER_ATTESTATION.md`; then run the bounded local harness against the exact Preview origin and retain statuses only. It makes one `/api/auth/me` request and at most nine synthetic login probes. |
| Redis timeout/fail-closed 503 | **BLOCKED** | No exclusive disposable Redis fixture or fault-test authorization is recorded. Owner must attest all four fault-test conditions in the deployment attestation; then use a separate disposable Preview deployment, perform one bounded request, restore and verify recovery. Never disrupt shared or Production Redis. |
| Direct write authorization and Testimonials persistence | **UNVERIFIED** | Existing route tests use isolated mocks; the operator’s 403 report does not enumerate Testimonials or POST/PATCH/DELETE. After staging DB/mail/Redis isolation is attested, use a disposable Super Admin record to confirm persisted create/update/delete and `staging_viewer` 403 for each method; remove only the disposable record. |
| Live CSRF/cross-origin rejection | **UNVERIFIED** | Local route regression tests pass, but no authenticated Preview request was exercised. With a disposable Preview session, make one cross-site mutation probe and confirm denial; record only status. |
| Preview/Production MongoDB isolation | **UNVERIFIED** | Owner must provide masked cluster/project identities, explicit `MONGODB_DB` presence, evidence Preview credentials cannot access Production, and least-privilege confirmation. Do not provide URIs or credential values. |
| Preview/Production Redis isolation | **UNVERIFIED** | Owner must provide masked resource/database identities, distinct token/HMAC scopes, required-variable presence by Vercel scope, and trusted client-IP header evidence. Do not provide keys/tokens. |
| Preview/Production mail isolation | **UNVERIFIED** | Owner must confirm Preview sink/test-recipient restriction and Production-only provider/sender scope, with masked evidence and sender-domain/DNS status. |
| Runtime, Vercel environment and deployed security headers | **UNVERIFIED** | CI/build success does not prove deployed Node 22 or `NODE_ENV=production`. Owner must confirm runtime and required variable presence/scope. Preview host could not be reached from this execution environment for a header probe; provide sanitized deployed HTTPS/header evidence, including HSTS, CSP decision, and cookie attributes from an auth response without sharing `Set-Cookie` values. |
| Backups, rollback, monitoring | **UNVERIFIED** | Owner must identify the last-known-good Production deployment/SHA, rollback owner/runbook, tested restore evidence, monitoring/alert owner, incident contact, and observation window. No Production settings or records were inspected. |
| Independent security review | **BLOCKED** | GitHub reports zero submitted reviews and zero requested reviewers. An eligible independent reviewer must be assigned to this exact SHA; record reviewer, decision, findings, and verification SHA. No self-approval. |
| Existing media upload/index and public endpoint findings | **UNVERIFIED** | Prior findings remain open: verify upload body/MIME/content and Blob access/lifecycle limits; inspect existing `publicId` index only on a staging/backup copy; review distributed abuse controls for public contact/consultation. No uploads, migrations, or destructive probes were run. |

## PR scope and non-destructive split plan

The current 96-file PR mixes authentication/session/origin/rate-limit and authorization fixes with unrelated portfolio experience components and portfolio QA/design documentation, a logo replacement, admin theme/global CSS work, and cleanup inventory. `docs/cleanup/DEPENDENCY_GRAPH.json` alone adds 5,502 generated lines. The admin Users/Roles permission work and Testimonials authorization/persistence fix are relevant to this release and should remain in the security review scope.

Do not rewrite or remove files from PR #3. Safest separation: keep this PR unchanged and draft; after owner approval, create a new branch from `main` for the unrelated portfolio/design/theme/cleanup changes, selectively apply only those files/commits, and open a separate PR with its own product review. Preserve PR #3 and its history until reviewers approve a split. Keep security-relevant authorization, auth/session, API, environment, rate-limit, test, and sign-off changes in the security diff.

## Independent reviewer packet

Review exact candidate `956c1e832a25ccf859caa8467a482a2ffdc5608c` in [PR #3](https://github.com/Anwar0904/adm-platform/pull/3). Focus on:

- `src/services/auth/**`, `src/app/api/auth/**`, `src/lib/auth/**`: revocation, refresh rotation/replay, reset/verification expiry, generic failures and cookies.
- `src/lib/security/**`, `src/config/env*`, `next.config.ts`, `.vercelignore`: origin/CSRF, distributed throttles/fail-closed behavior, production DB selection, runtime and headers.
- `src/app/api/users/**`, `src/app/api/roles/**`, `src/app/api/testimonials/**`, `src/lib/permissions/admin-access.ts`, `src/components/admin/layout/admin-shell.tsx`, `src/components/admin/testimonials/testimonials-management.tsx`: server authorization, permission-derived UI and persisted operations.
- `src/app/api/*integration.test.ts`, `src/lib/**.test.ts`: verify test isolation and avoid treating mocks as live evidence.

## Findings and release decision

- **Critical:** none identified by the checks recorded above; this is not a complete independent security review.
- **High blockers:** exposed-session invalidation is unconfirmed; live auth lifecycle and rate-limit behavior are incomplete; owner isolation/runtime/rollback evidence and independent review are absent.
- **Other open findings:** media upload/index and public endpoint checks remain unverified. CSP remains absent; do not add a restrictive policy without a nonce-aware compatibility review.
- **Low:** ESLint exits 0 with 76 warnings; warnings were not broadly cleaned up in this release pass.

**Final recommendation: NO-GO for merge or Production release.** Keep PR #3 unmerged until the exposed sessions are invalidated, mandatory owner evidence and reviewer findings are recorded, and remaining live Preview gates are closed or explicitly dispositioned by the release owner. No Production changes were made.
