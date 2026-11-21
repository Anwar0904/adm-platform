# Remediation and regression plan

## Implemented in this working tree

- Auth tokens are delivered by an explicit, fixed-host Resend adapter and are never returned in JSON. Mail links put the token in the URL fragment, and the client strips it before API submission.
- Reset and verification use hashed expiring values and atomic one-use MongoDB updates. Reset/change password revoke active sessions.
- Signup is disabled by default; generic anti-enumeration responses, allowlisted user DTO, same-origin protection, and process-local throttles were added.
- Change password uses authenticated user identity; API error logs no longer serialize arbitrary exceptions.
- User create/update role assignment requires `ROLE_UPDATE` in addition to user create/update authorization.
- Production DB test route is hidden; media uploads are byte-bounded before form parsing, disallow SVG, cap file count, check file signatures, and no longer alter DB indexes at request time.
- Media search is literal, bounded, and capped; obsolete XSS header removed.

## Checks executed

| Check | Result |
| --- | --- |
| `npm.cmd run typecheck` | Passed after the auth UI and user-role changes. |
| Targeted ESLint over auth/security/media/error paths | 0 errors; one default-export style warning remains in `auth.service.ts`. |
| `npm.cmd ls --all --json` | Completed successfully; installed graph saved to `docs/cleanup/DEPENDENCY_GRAPH.json`. This is inventory, not an advisory audit. |
| `npm.cmd audit --omit=dev` | Could not reach `https://registry.npmjs.org/-/npm/v1/security/advisories/bulk`; no vulnerability result was obtained. |
| Test suite | Prior invocation under Node 26 failed before assertions because `os.userInfo()` returned `uv_os_get_passwd returned ENOMEM`; run under Node 22. |
| Production DB/seed/deployment | Not accessed or executed. |

## Required regression checks before release

1. Under Node 22, run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and current `npm audit` in CI; attach results to the release record.
2. Unit tests: token digest and expiry; atomic one-use reset/verification; unknown/known email response equivalence; mail failure cleanup; disabled signup; safe default role; DTO secret exclusion; password change identity; limiter bounds and reset behavior; same-origin/Fetch Metadata cases.
3. Integration tests against disposable MongoDB: reset changes password and revokes every session; verify token is one-use and expired token rejected; failed delivery leaves no usable token; role privilege escalation denied.
4. Upload tests: oversized `Content-Length`, chunked oversize body, malformed multipart, 0/6 files, 10 MB/file boundary, spoofed MIME/signature, SVG, traversal-like filenames, DB failure cleanup, and public storage content type.
5. Staging browser tests: login/refresh/logout, CSRF attempts, reset/verification link token fragment removal, password manager behavior, rate limiting across replicas, CSP report-only compatibility, and every admin route permission.
6. Review user/role lifecycle for role assignment denial without `ROLE_UPDATE`, last-admin protection, self-deactivation, privilege changes, and session revocation; inspect every public mutation for abuse controls.

## Deployment dependencies

- Configure `AUTH_EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, `AUTH_EMAIL_BASE_URL`; ensure the base origin matches `SITE_URL` or approved `ADM_ALLOWED_ORIGINS` and the production URL uses HTTPS.
- Keep `AUTH_PUBLIC_SIGNUP_ENABLED` unset/false unless product and security owners approve open signup and the default role has no permissions.
- Configure a distributed edge/shared-store rate limiter. Set `ADM_TRUSTED_CLIENT_IP_HEADER` only to a header overwritten by the trusted proxy.
- Review MongoDB media index state and prepare a separately approved migration if needed; do not run index changes from HTTP requests.
