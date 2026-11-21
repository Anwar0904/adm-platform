# API route authorization matrix

This matrix is based on a source scan of `src/app/api/**/route.ts` and handler review. Permission names are sourced from `src/constants/permissions.ts`. This is a review aid, not a substitute for runtime authorization tests.

| Route family | Access policy observed | Notes |
| --- | --- | --- |
| `/api/auth/login` | Public POST | Same-origin required; identifier limiter; allowlisted response DTO. |
| `/api/auth/register` | Public POST only when `AUTH_PUBLIC_SIGNUP_ENABLED=true` | Disabled by default; requires email provider; generic accepted response. |
| `/api/auth/forgot-password` | Public POST | Generic response; mail config checked; account/IP limiter. |
| `/api/auth/resend-verification` | Public POST | Generic response; mail config checked; account/IP limiter. |
| `/api/auth/verify-email`, `/api/auth/reset-password` | Public POST with one-time token | Same-origin mutation check; atomic expiring token consume. |
| `/api/auth/refresh`, `/api/auth/logout` | Cookie session POST | Same-origin required. |
| `/api/auth/change-password` | Authenticated POST | Uses authenticated principal; verifies current password; revokes sessions. |
| `/api/auth/me` | Authenticated GET | Returns current user fields. |
| `/api/public/**` | Intentionally public GET; selected contact/consultation POST | Validate input and apply edge abuse controls before production. |
| `/api/test-db` | 404 in production; nonproduction requires `settings.manage` | No longer an anonymous database probe. |
| `/api/seed/roles` | Disabled in production; privileged outside production | Destructive seed behavior was not run. |
| `/api/blogs/view/[id]` | Public PATCH by design for view counting | Must remain limited to the view-count operation; verify abuse controls separately. |
| `/api/users/**`, `/api/roles/**` | Permission gated | Assigning a user role additionally requires `role.update`; review self/last-admin protections before release. |
| `/api/media/**` | `media.read/create/update/delete` permissions | Upload now bounds body and validates signatures; production storage limits remain. |
| `/api/dashboard`, `/api/admin/**` | Permission gated | Permission constant is checked in the route handler. |
| `/api/blogs/**`, `/api/services/**`, `/api/portfolio/**`, `/api/pages/**`, `/api/faqs/**`, `/api/tags/**`, `/api/categories/**`, `/api/industries/**`, `/api/team-members/**`, `/api/testimonials/**`, `/api/leads/**`, `/api/consultations/**`, `/api/settings` | Permission gated for admin operations | Public counterparts are under `/api/public/**`. Verify each dynamic action against its intended permission in regression review. |

## Review rules

- New admin handlers must call `requireAuth`, `requireRole`, or `requirePermission` before reading or mutating protected data; use least privilege.
- Do not rely on `src/proxy.ts` cookie presence as authorization. It is only a navigation gate.
- Cookie-authenticated mutations must preserve same-origin enforcement. Explicit Bearer API clients are a separate trust mode.
- Public endpoints need schema validation, bounded work, and abuse controls. Do not include internal exceptions, secrets, or account existence in responses.
