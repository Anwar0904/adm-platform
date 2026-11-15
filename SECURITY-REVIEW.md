# Admin Sliding Session Security Review

## Scope and status

This review covers the seven-day sliding admin session implementation and the auth-related fixes in the current worktree. Production environment values were not inspected. Findings below distinguish fixes made in this worktree from residual risks.

## Findings

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|----------|------|-------|---------------|------------|
| 1 | 🟠 HIGH | src/services/auth/auth.service.ts | 447-477 | RESOLVED: logout previously required the current refresh-token hash, so a valid stale cookie could leave its server session active. Logout now verifies the signed session ID and revokes that user’s active session. | 9/10 |
| 2 | 🟡 MEDIUM | src/app/api/settings/route.ts | 44-88 | RESOLVED: POST/PATCH authenticated twice, allowing refresh-cookie rotation between checks to make the second check fail. The user returned by the permission check is now reused. | 9/10 |
| 3 | 🟡 MEDIUM | src/proxy.ts | 22-43 | RESOLVED: an access-cookie-presence redirect on the login route could loop when the dashboard rejected a stale or revoked session. Login no longer redirects based only on cookie presence. | 9/10 |
| 4 | 🟡 MEDIUM | src/components/admin/layout/admin-shell.tsx; src/lib/auth/require-auth.ts | 34-36, 95-238 | RESOLVED: background/API access-token recovery could extend the idle session. Only explicit UI activity now updates session activity; API recovery renews access tokens without touching session expiry or rotating refresh tokens. | 8/10 |
| 5 | 🟡 MEDIUM | src/services/auth/auth.service.ts; src/repositories/session.repository.ts | 26-67, 320-423; 37-99 | PARTIALLY RESOLVED: refresh-token replacement is compare-and-update; a losing concurrent request returns 409 rather than logging the administrator out. If the server commits rotation but the response and Set-Cookie are lost, the browser can retain a stale token and later fail renewal after its access token expires. Recovery for that response-loss case is not implemented. | 8/10 |
| 6 | ⚪ LOW | src/config/env.ts; src/lib/auth/jwt.ts | 40; 36-49 | RESOLVED: JWT_REFRESH_EXPIRES was configured but ignored by the refresh signer. The misleading setting was removed; refresh JWT expiry is now fixed to the seven-day session policy. | 9/10 |

## A. Confirmed correct behavior

- Refresh JWT lifetime and database session expiry both use the fixed seven-day idle-timeout constant. Activity and expiry timestamps are normalized to whole seconds.
- Database session lookups require an unrevoked session with `expiresAt > now`; the MongoDB TTL index is on `expiresAt`. TTL cleanup may be delayed by MongoDB, but authentication does not rely on TTL deletion.
- Session activity updates use an atomic `$max` for `lastActivityAt` and `expiresAt`.
- Refresh tokens are stored as bcrypt hashes and replacement uses an atomic conditional update. A previous token that no longer matches is rejected.
- Access-token renewal through the API checks the active refresh session but does not extend idle expiry or rotate the refresh token.
- Refresh-cookie Max-Age is clamped to the session expiry. Cookies remain HttpOnly, SameSite=Lax, Path `/`, and Secure when `NODE_ENV=production`.
- Server-rendered dashboard fallback reads and validates the refresh session without attempting to mutate cookies.

## B. Corrected defects

- Logout now revokes by verified session ID and user ID, even when the presented refresh token was rotated.
- Settings POST/PATCH perform permission authentication once.
- Login-route proxy behavior no longer traps users with stale cookies in a redirect loop.
- Automatic API requests cannot keep an abandoned session alive; only explicit UI activity reports activity.
- Concurrent refresh requests no longer produce an authentication-shaped 401 for the losing rotation attempt.

## C. Race conditions and residual risk

The database compare-and-update ensures only one concurrent refresh rotation wins. The losing request receives 409 and the client does not immediately log the user out. Cross-tab refreshes are serialized when the browser supports Web Locks.

There is still a response-loss edge: if the server commits a rotation but the client never receives the response carrying the new cookie, the old token is rejected. The client makes one retry and does not immediately clear authentication state, but it cannot recover the new refresh token. Once the access token expires, protected API renewal may fail until the administrator signs in again. This needs a deliberate recovery design and an integration test before claiming seamless recovery from all network failures.

## D. Test coverage and gaps

Added or updated tests cover:

- Seven-day expiry calculation at second precision and the exact expiry boundary.
- Logout using a stale, signed refresh token after rotation.
- API access-token renewal without activity updates or refresh-token rotation.
- Rejection of an old refresh token without revoking the active session.
- A simulated concurrent rotation where one request wins and the other receives 409.

Still missing:

- Real MongoDB integration coverage for the TTL index, expiry query boundaries, and concurrent compare-and-update behavior.
- Route/client integration coverage for UI activity debounce, inactivity, cross-tab coordination, and refresh-response loss.
- Cookie option and Max-Age tests in production and development modes.
- End-to-end tests for Server Component fallback and settings POST/PATCH refresh behavior.

## E. Production environment configuration

- `JWT_ACCESS_SECRET`: required in production; use a strong, independently generated secret.
- `JWT_REFRESH_SECRET`: required in production; use a strong secret distinct from the access secret.
- `JWT_ACCESS_EXPIRES`: access-token lifetime; defaults to `24h`. The database session check remains authoritative and caps usable access at session expiry.
- `MONGODB_URI`: required production database connection; must not point to localhost.
- `NODE_ENV=production`: enables Secure cookies.
- `JWT_REFRESH_EXPIRES` is no longer read or needed. Refresh JWT lifetime is fixed at seven days in code.

No secret values were inspected or included in this report.

## F. Deployment assessment

The audited fixes are implemented, and focused regression tests, the full test suite, TypeScript, and targeted auth lint were run successfully. The full suite passed 23 tests. Targeted lint reported warnings but no errors; linting the changed admin shell also surfaces two existing set-state-in-effect errors unrelated to the activity-sync change.

The production build was not rerun after these edits because the existing development server may hold the shared `.next` output. Do not treat this report as final production certification until a clean production build and the missing integration checks—especially the response-loss case—are completed.
