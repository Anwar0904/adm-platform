# Security findings register

Status is based on the current source tree. Severity reflects source-level risk; production impact needs environment validation.

| ID | Severity | Finding | Status / evidence |
| --- | --- | --- | --- |
| SEC-001 | Critical | Reset and verification tokens were returned by auth APIs, exposing account control capabilities. | Remediated in source: tokens are sent only through configured mail; handlers return generic responses. |
| SEC-002 | High | Unknown reset/resend accounts had distinguishable responses. | Remediated in source: generic accepted response and no-op service behavior. |
| SEC-003 | Critical | Change-password accepted a caller-supplied user ID without authenticating that user. | Remediated in source: requires auth and uses `currentUser._id`. |
| SEC-004 | High | Reset and verification token consumption was not atomic; verification expiry was not enforced. | Remediated in source using expiry filters and atomic single-use updates. |
| SEC-005 | High | Auth endpoints lacked same-origin protections and request throttling; Bearer headers could bypass origin checks. | Source remediated: cross-site Origin/Fetch Metadata checks run even when an Authorization header is present; bearer clients may omit Origin only when no cross-site metadata or untrusted Origin is supplied. Distributed Upstash rate limiting is implemented. Preview configuration, cross-instance behavior, and live 429/503 outcomes remain unverified. |
| SEC-006 | High | Registration could fall back to a privileged/missing default role and email delivery was not established. | Remediated in source: signup disabled by default, provider required, role must be nonprivileged with no permissions. Runtime config unverified. |
| SEC-007 | High | Auth responses could expose broader user/role objects. | Remediated for login with allowlisted DTO; audit other auth response consumers during release review. |
| SEC-008 | High | Anonymous `/api/test-db` revealed database reachability. | Remediated: production 404; nonproduction requires `settings.manage`; raw exception logging removed. |
| SEC-009 | High | Media upload accepted SVG and trusted declared MIME; request parsed before per-file limits; upload request performed index drop/create. | Partially remediated: SVG removed, body bounded before parsing, count cap, signature checks, runtime DDL removed. Existing DB index migration and image-dimension/decoder review remain. |
| SEC-010 | Medium | Media search used user-supplied regex and unbounded result count. | Remediated in source: literal escaped/bounded search and 100-row cap. |
| SEC-011 | Medium | API exception handler logged raw errors and returned custom error details. | Remediated in source: logs safe name/status only; custom error details suppressed. Zod validation details remain path/message-only and should be monitored. |
| SEC-012 | Medium | `X-XSS-Protection` was set despite being obsolete. | Remediated by removing it. CSP remains absent pending compatibility and reporting design. |
| SEC-013 | High | Dependency risk and current advisory status not validated against current registry data. | Latest evidence: GitHub Actions quality run #19 passed `npm audit --audit-level=high` for commit `da77e82c7f1be92e20839c70248f34e7a0971feb`. Re-run on the final reviewed candidate if dependency inputs change. |
| SEC-014 | High | Production rate limiting depends on correct shared Redis and trusted proxy configuration. | Source remediated: atomic Upstash limiter, fixed Production `x-forwarded-for`, no Production memory fallback, generic fail-closed 503. Preview/Production resource scopes, timeout behavior, and deployed 429/503 outcomes remain unverified. |
| SEC-015 | High | No mail-provider credentials/configuration or deployed callback-origin validation was available. | Open: provider adapter is opt-in and fails closed; validate domain, DNS, sender, TLS, and secret rotation in staging. |
| SEC-016 | Medium | Local Windows `tsx` startup may fail before assertions because `os.userInfo()` returns `uv_os_get_passwd ENOMEM`. | Current worktree tests pass with a temporary invocation-only shim, not plain `npm test` on this host. Run fresh supported-runtime Node 22 CI before release; do not commit the shim. |
| SEC-017 | Medium | CSP, proxy upload limits, and deployed header delivery are unverified. | Source now sets host-only one-year HSTS without `includeSubDomains`/`preload`; owner must validate actual TLS/header delivery. CSP remains open for nonce-aware compatibility rollout. |
| SEC-018 | High | User create/update accepted role IDs with only user create/update permissions. | Remediated in source: role assignment now also requires `ROLE_UPDATE`; verify least-privilege role policy in integration tests. |
| SEC-019 | Medium | Logout accepted a valid but stale rotated refresh token by session ID alone, allowing token replay to revoke the current session. | Remediated and covered locally: logout now finds the active session, bcrypt-compares the presented refresh token with the current hash, then revokes atomically using that hash. Stale-token logout is rejected. |

No cleanup candidate has been deleted. See [CLEANUP_CANDIDATES.md](../cleanup/CLEANUP_CANDIDATES.md) and [DELETION_MANIFEST.md](../cleanup/DELETION_MANIFEST.md).
