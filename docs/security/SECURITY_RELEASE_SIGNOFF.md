# ADM security release signoff

**Review date:** 2026-11-21  
**Candidate:** `security/platform-hardening-review` at `6ab4d2adb2525334478464f600165047cc3f544d`  
**Pull request:** [#3](https://github.com/Anwar0904/adm-platform/pull/3), currently Draft  
**Decision:** **NO-GO — do not merge or deploy. Keep PR #3 Draft.**

This review confirms useful source-level fixes and green CI/Preview checks, but cannot establish staging runtime behavior or deployment configuration. Several production gates remain open, including isolated-account flow testing, distributed abuse controls, and deployed TLS/header/storage configuration. The user-provided statement that Preview uses a separate MongoDB cluster and database was treated as context; it was not independently verified.

## 1. Verified security fixes

Source review of the findings register, route matrix, release gates, auth services/routes, session/JWT helpers, permission checks, upload handler, diagnostic/seed routes, error handler, proxy, and Next.js headers configuration found these controls implemented:

- Login returns an allowlisted user DTO. Access and refresh JWTs are set as HttpOnly, SameSite=Lax cookies; production cookies are Secure. Refresh credentials are bcrypt-hashed in MongoDB sessions.
- Refresh tokens rotate against the active session. Logout, password reset, and password change revoke sessions. Password change derives identity from the authenticated principal and checks the current password.
- Password reset and email-verification tokens are stored as digests, expire, and are consumed with atomic updates. Auth email links keep the token in the URL fragment; the client removes the fragment before API submission. API recovery responses are generic and do not return tokens.
- Browser mutations have same-origin checks; auth request limiting is bounded and process-local. Signup is disabled unless explicitly enabled and checks the default role and email provider.
- Admin route handlers use permission checks. User role assignment additionally requires `ROLE_UPDATE`.
- Media upload bounds request bytes before multipart parsing, caps files and per-file size, rejects SVG, checks extension and signatures, and no longer changes MongoDB indexes during an upload. Search is escaped and capped.
- `/api/test-db` returns 404 when `NODE_ENV=production`; the role seed endpoint returns 404 in production. API exception logs omit exception messages and response details.
- Configured response headers include frame, content-type, referrer, and permissions policies. **CSP and HSTS are not configured in this source.**

These are source-review findings, not proof of deployed runtime behavior. The existing tests cover refresh/session behavior and now also cover the auth DTO allowlist, same-origin guard, and limiter boundaries. Full account lifecycle and upload integration remain untested.

## 2. Tests performed and evidence

| Check | Evidence/result |
| --- | --- |
| Source and documentation review | Reviewed the security findings register, release gates, threat model, route authorization matrix, hardening checklist, remediation plan, auth/session/JWT/email code, user/role/media routes, diagnostics/seed routes, proxy, and response headers. |
| GitHub checks for candidate SHA | Five check runs succeeded: Vercel Preview Comments, ESLint, TypeScript and unit tests, Production build, and Dependency advisory audit. The separate Vercel commit status says deployment completed. The checks refer to the exact candidate SHA above. |
| `npm run typecheck` | Passed under Node `v22.23.5`, both before and after adding regression tests. |
| `npm run lint` | Passed: 0 errors, 77 warnings. No lint rule was disabled. |
| `npm test` | The requested command initially failed before assertions: all 21 then-discovered test workers hit `uv_os_get_passwd returned ENOMEM` in TSX's temporary-directory initialization. It was rerun unchanged with a temporary Node preload supplying only a temp-directory username. All 67 assertions across 24 files passed, including newly added security regression tests. The temporary preload was removed and did not change repository files or test assertions. |
| `npm run build` | Passed under Node `v22.23.5`; Next.js `16.4.5` compiled and generated all 74 static pages. |
| `npm audit --audit-level=high` | No local result: npm could not reach its registry audit endpoint. GitHub's Dependency advisory audit check for the candidate SHA succeeded, but its advisory details were not available in this local run. |
| Pull request state | PR #3 is open, mergeable, and still Draft. No PR state was changed. |

## 3. Tests not performed and why

No browser session, dedicated staging accounts, test mailbox, or Preview database access was available in this workspace. No auth-flow or database-backed request was sent to Preview, to avoid triggering email delivery or touching an account without an explicitly dedicated test identity. No destructive tests were run against any environment.

Consequently, the following controls have **not** been demonstrated end to end: successful/failed login; logout revocation; access renewal and refresh rotation/replay; password reset and email verification expiry/single-use; known/unknown account response equivalence; out-of-band delivery and token secrecy; unauthorized admin access; least-privilege role boundaries; upload rejection/storage behavior; deployed diagnostic/maintenance behavior; and deployed error/log redaction.

### Exact manual staging procedure

Run this in the Preview environment only after its MongoDB cluster/database and mail sink are independently confirmed isolated from Production. Use unique, disposable accounts and inboxes. Capture status codes and redacted response shapes only; never paste bearer tokens, cookie values, recovery links, or full request/response HARs into tickets or CI logs.

1. Create dedicated active admin, read-only, disabled, and unverified accounts with least-privilege roles, plus a mailbox under tester control. Keep signup disabled unless testing it is specifically approved.
2. In a clean browser profile, log in with the active account; verify the profile fields are allowlisted and credentials exist only in HttpOnly cookies. Try a wrong password, unknown email, disabled account, and unverified account. Record status/body behavior without credentials.
3. Call an authenticated read endpoint, then logout. Verify cookies are cleared, `/api/auth/me` rejects the prior session, and refresh with the revoked session fails. Do not export or print cookie values.
4. Refresh with a valid session using a new activity timestamp. Verify access renewal, refresh-cookie rotation, rejection of replayed old refresh state, and continued validity of the new session. Test an expired session using an isolated fixture or a naturally expired test session.
5. Request password reset for both the dedicated account and an unknown address. Compare HTTP status and response shape. Confirm delivery only through the controlled inbox, that the API body contains no token, and that the link carries its token in the fragment and the page removes it before the API call. Complete one reset, verify old password rejection, session revocation, second-use rejection, and expiry rejection using a controlled staging fixture.
6. Repeat for email verification: verify generic resend response for known and unknown addresses, mail-only token delivery, expiry rejection, and one-use behavior. If testing signup, verify disabled-by-default behavior first and confirm the created account receives a zero-permission role.
7. Without authorization, request representative protected endpoints (`/api/users`, `/api/roles`, `/api/media`, `/api/settings`) and verify 401/403 without protected data. Repeat with read-only and admin accounts, including a role assignment attempt without `ROLE_UPDATE`; exercise only disposable staging records.
8. Exercise uploads using disposable files: zero and six files; exactly five; just over the 10 MB file limit; request over 32 MB; malformed multipart; SVG; mismatched extension/MIME/signature; valid JPEG/PNG/PDF fixtures; traversal-like filenames; and storage/DB failure cleanup. Confirm no unintended public object or database record remains. Remove test artifacts only from the isolated staging store.
9. Confirm Preview `/api/test-db` is hidden under production runtime mode and `/api/seed/roles` is disabled. Never invoke seed or maintenance writes outside isolated Preview. Inspect generic error responses and staging logs for credentials, tokens, addresses, raw exception messages, or provider response bodies.
10. Check response headers, TLS redirect/HSTS, request limits, trusted client-IP propagation, and throttling across separate Preview instances. Record the deployed SHA and masked configuration-presence evidence. Stop and report any cross-environment database or email routing before further tests.

## 4. Remaining vulnerabilities and limitations

- **High:** Rate limiting is process-local and has no default trusted client IP. It does not provide distributed protection against credential stuffing or multi-instance abuse.
- **High:** Preview/Production email provider credentials, sender-domain verification, callback origin, and delivery/bounce handling were not inspected or tested.
- **High:** No adversarial route-by-route permission test exists for the full admin API surface; last-admin, self-deactivation, role change, and privilege-change revocation behavior need integration review.
- **High:** Current local dependency advisory audit could not reach npm. The GitHub audit check is green, but the registry/advisory report was not independently reviewed here.
- **Medium:** CSP and HSTS are absent in source; deployed TLS, response headers, reverse-proxy request limits, and upload serving policy are unverified.
- **Medium:** Upload signature checks do not validate image dimensions or safely decode/transform complex content; malware scanning, storage lifecycle, and serving headers are unverified.
- **Medium:** Existing MongoDB media index state and least-privilege database/network/backups were not inspected. No migration or data operation was performed.
- **Medium:** Preview/Production config separation and actual database connectivity were not independently verified. The local `.env.local` key names indicate local DB/JWT configuration only; values were not read. It does not establish Preview or Production scope.
- No independent security reviewer signoff, deployed SHA record, backup-restore drill, monitoring owner, or rollback rehearsal was available.

## 5. Preview configuration assessment

The matching-SHA GitHub record confirms a successful Preview deployment, and the PR's Vercel status confirms a completed deployment. Per task context, Preview is intended to use a separate MongoDB cluster and database. Neither the Preview variables nor their scopes/values, Vercel project settings, DB identity, connectivity, Blob token scope, or email routing could be inspected in this session.

Before release, an owner must attest—without sharing values—that Preview and Production have distinct `MONGODB_URI` targets and database names; unique JWT signing secrets; scoped Blob credentials; and separate mail/test routing. Confirm presence and correct scope for `MONGODB_URI`, `MONGODB_DB`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `AUTH_EMAIL_PROVIDER`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, `AUTH_EMAIL_BASE_URL`, `ADM_ALLOWED_ORIGINS`, `ADM_TRUSTED_CLIENT_IP_HEADER`, and `AUTH_PUBLIC_SIGNUP_ENABLED`. Verify `NODE_ENV=production` behavior on Preview and that public signup remains disabled unless approved. Do not paste any values into this signoff.

## 6. Production deployment prerequisites

- Close the staging tests above and attach sanitized evidence against the exact candidate SHA.
- Verify provider domain/DNS/sender/TLS, callback allowlist, mail delivery, and secret rotation in staging.
- Deploy distributed edge/shared-store rate limits and a trusted proxy IP header overwritten by the trusted proxy.
- Confirm Preview/Production database and secret separation, least-privilege MongoDB access, backup/restore, and existing index state. Plan any index migration separately with owner review.
- Verify Blob token scope, public storage decision, upload/body/time limits, and response headers. Establish CSP compatibility/reporting and HSTS/TLS policy.
- Obtain route lifecycle regression and independent security review signoff; record monitoring and incident owners.
- Re-run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm audit --audit-level=high` on Node 22 in a supported environment and attach current results.
- Record exact candidate and deployed SHA, deployment identifier, approval, rollback target, and post-deploy monitoring window. Do not deploy Production as part of this review.

## 7. Release decision

**NO-GO for merge to `main` and NO-GO for Production release.** Green checks show that the candidate builds and its automated CI checks pass; they do not close the required runtime, configuration, and independent-review gates. Keep PR #3 Draft. Do not convert it to Ready for Review unless all critical gates above pass. No merge or Production deployment was performed.

## 8. Rollback and post-deployment monitoring checklist

Before any approved Production rollout:

- Record the last known-good deployment and commit, candidate SHA, deployment ID, owner contacts, and rollback command/path.
- Confirm no unreviewed DB/index migration is coupled to rollout; take/verify a recoverable backup and preserve current secrets until the rollback decision is made.
- Set a defined observation window and thresholds for auth failures, 401/403/429 rates, refresh conflicts, email delivery failures, 5xx, MongoDB errors/latency, upload rejection/storage errors, and edge limits.

After rollout:

- Verify only the approved SHA is serving. Smoke-test login, `/api/auth/me`, refresh, logout, recovery mail delivery, protected API denial, upload limits, and production diagnostic 404 using approved test accounts and redacted evidence.
- Monitor auth, mail, edge, database, and storage alerts; check logs for accidental credentials, cookies, tokens, and personal data.
- If thresholds or security behavior fail, stop rollout and restore the last known-good deployment. Recheck auth/session compatibility and configuration scope; preserve evidence and notify the named incident owner.
- After rollback or incident containment, rotate any exposed credentials and revoke affected sessions/tokens where applicable. Record the deployed/rolled-back SHA and follow-up actions.
