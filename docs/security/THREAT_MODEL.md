# ADM threat model

## Assets

- User passwords, email addresses, profile data, roles, permissions, and session cookies.
- Password reset and email verification capabilities.
- Admin-managed portfolio, blog, media, leads, consultations, settings, and other CMS content.
- MongoDB availability and integrity; public blob storage contents; deployment and email-provider credentials.

## Trust boundaries

1. Browser or API client to Next.js route handlers (`src/app/api/**`).
2. Cookie/JWT identity to permission checks in `require-auth.ts` and `auth.middleware.ts`.
3. Next.js application to MongoDB, Resend, and Vercel Blob.
4. Uploaded file bytes and metadata to public storage/browser rendering.
5. Build/deployment configuration to production runtime secrets and hosting controls.

## Threat actors and relevant abuse

- Anonymous internet users: account enumeration, credential stuffing, reset/verification abuse, request floods, upload abuse, and exploitation of public routes.
- Authenticated low-privilege users: horizontal access, role escalation, mass assignment, and malicious CMS payloads.
- Compromised admin account: content tampering, user/role changes, data exposure, and public file hosting abuse.
- Supply chain or deployment actor: vulnerable dependencies, leaked credentials, unsafe seed/migration execution, or deployment of unreviewed source.

## Controls and residual risks

- Reset/verification request responses are generic and token values are never returned by the API. Stored tokens are digested and atomically consumed. Mail links carry tokens in URL fragments; the client removes the fragment before submitting.
- Signup is off unless explicitly enabled; default role permission safety is checked. The Resend adapter is fixed-host and fails closed when configuration is incomplete.
- Browser cookie mutations use same-origin checks. Bearer-token clients are exempt because browser ambient-cookie CSRF does not apply to an explicitly supplied Authorization header.
- Auth request limiting now uses an atomic Upstash Redis Lua operation in Production, with retries disabled, a 1,500 ms abort timeout, a fixed Vercel `x-forwarded-for` source, and fail-closed 503 behavior. Production has no process-local fallback. Preview/Production Redis isolation, deployed 429/503 outcomes, trusted proxy behavior, and latency remain unverified. Other public endpoints still need separate abuse-control review.
- Content security policy is not yet deployed. Rich-text rendering and every HTML sink require a separate review before enforcing CSP.
- Upload signatures reduce MIME spoofing; complex media decoding, image dimension limits, antivirus scanning, storage lifecycle, and edge request limits need staging validation.
- Admin authorization is evidenced by source pattern scans, not a route-by-route adversarial test. Route drift and nested handlers remain a review risk.
- User creation/update role assignment requires `ROLE_UPDATE` in addition to user create/update access. Last-admin lifecycle protections and revocation behavior still need integration review.
- Database index reconciliation is intentionally removed from upload requests; existing production index state requires an owner-reviewed migration plan.

## Release assumptions

The application runs on Node 22, secrets are injected by the hosting environment, proxy limits are configured, MongoDB has least-privilege access and backups, and a staging browser/security review has passed. None of those environment assumptions was verified in this source-only pass.
