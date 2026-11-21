# ADM security baseline

**Review date:** 2026-11-20  
**Scope:** source review of the working tree in this checkout. This is not a penetration test, CI attestation, production review, or release approval.

## Application and runtime

- Next.js `16.4.5`; React `19.2.4`; Mongoose `9.12.2` (manifest ranges and lockfile govern exact install).
- `package.json` declares Node `>=22 <23`; the available runtime during this review was Node `26.13.0`, outside the supported range.
- Authentication uses JWT access and refresh tokens, HttpOnly cookies, MongoDB-backed sessions, and bcrypt password hashes. Refresh tokens are stored as bcrypt hashes in sessions.
- Password reset and email verification tokens are random values stored as SHA-256 digests with expiry. Tokens are single use via atomic MongoDB `findOneAndUpdate` consumption.
- Public signup is disabled unless `AUTH_PUBLIC_SIGNUP_ENABLED=true`. Signup additionally requires a safe default role and configured email delivery.
- Email delivery is an opt-in Resend REST adapter. It requires `AUTH_EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, and `AUTH_EMAIL_BASE_URL`. The base URL must match `SITE_URL` or an origin in `ADM_ALLOWED_ORIGINS`; production requires HTTPS.
- Rate limits for login/reset/verification/signup are process-local. They do not coordinate across server instances and use a client IP only when `ADM_TRUSTED_CLIENT_IP_HEADER` is explicitly configured.
- API logs now emit generic error names and status codes; auth email failures log only flow kind and safe provider code.

## Security controls observed or implemented

- Authorization helpers enforce route permissions and reject cross-site browser mutation requests using Origin and Fetch Metadata checks.
- Admin APIs are permission gated in the route handlers. Public read/write endpoints are listed separately in [ROUTE_AUTH_MATRIX.md](ROUTE_AUTH_MATRIX.md).
- Authentication responses use an allowlisted user DTO. Authenticated endpoints do not return password hashes, reset/verification tokens, or role permission lists.
- Password reset revokes all active sessions. Password change verifies the current password and uses the authenticated principal rather than a caller supplied user ID.
- Media upload no longer accepts SVG, bounds multipart bytes before parsing, caps file count, and checks declared MIME against content signatures.
- Existing frame, nosniff, referrer, and permissions headers remain. The obsolete `X-XSS-Protection` header was removed.

## Verification limitations

- Typecheck and lint were run in this working tree; see [REMEDIATION_AND_REGRESSION.md](REMEDIATION_AND_REGRESSION.md).
- The repository test harness previously failed before assertions under the available Node 26 runtime (`os.userInfo()` returned `uv_os_get_passwd returned ENOMEM`). Run it under the declared Node 22 range before release.
- No production credentials were read, no production database was accessed, and no deployment was performed.
- Provider credentials, edge rate limiting, DNS/TLS, reverse proxy limits, CSP compatibility, runtime Node version, current CI result, and deployed commit SHA remain unverified.
