# Security findings register

Status is based on the current source tree. Severity reflects source-level risk; production impact needs environment validation.

| ID | Severity | Finding | Status / evidence |
| --- | --- | --- | --- |
| SEC-001 | Critical | Reset and verification tokens were returned by auth APIs, exposing account control capabilities. | Remediated in source: tokens are sent only through configured mail; handlers return generic responses. |
| SEC-002 | High | Unknown reset/resend accounts had distinguishable responses. | Remediated in source: generic accepted response and no-op service behavior. |
| SEC-003 | Critical | Change-password accepted a caller-supplied user ID without authenticating that user. | Remediated in source: requires auth and uses `currentUser._id`. |
| SEC-004 | High | Reset and verification token consumption was not atomic; verification expiry was not enforced. | Remediated in source using expiry filters and atomic single-use updates. |
| SEC-005 | High | Auth endpoints lacked same-origin protections and request throttling. | Partially remediated: same-origin checks and bounded process-local limiter added. Distributed/edge throttling remains required. |
| SEC-006 | High | Registration could fall back to a privileged/missing default role and email delivery was not established. | Remediated in source: signup disabled by default, provider required, role must be nonprivileged with no permissions. Runtime config unverified. |
| SEC-007 | High | Auth responses could expose broader user/role objects. | Remediated for login with allowlisted DTO; audit other auth response consumers during release review. |
| SEC-008 | High | Anonymous `/api/test-db` revealed database reachability. | Remediated: production 404; nonproduction requires `settings.manage`; raw exception logging removed. |
| SEC-009 | High | Media upload accepted SVG and trusted declared MIME; request parsed before per-file limits; upload request performed index drop/create. | Partially remediated: SVG removed, body bounded before parsing, count cap, signature checks, runtime DDL removed. Existing DB index migration and image-dimension/decoder review remain. |
| SEC-010 | Medium | Media search used user-supplied regex and unbounded result count. | Remediated in source: literal escaped/bounded search and 100-row cap. |
| SEC-011 | Medium | API exception handler logged raw errors and returned custom error details. | Remediated in source: logs safe name/status only; custom error details suppressed. Zod validation details remain path/message-only and should be monitored. |
| SEC-012 | Medium | `X-XSS-Protection` was set despite being obsolete. | Remediated by removing it. CSP remains absent pending compatibility and reporting design. |
| SEC-013 | High | Dependency risk and current advisory status not validated against current registry data. | Open: lockfile graph captured; `npm audit`/CI requires supported runtime/network and owner review. |
| SEC-014 | High | Runtime rate limiting uses process memory and no default trusted client IP. | Open: configure managed edge/shared-store limiter; current source control is only a local safeguard. |
| SEC-015 | High | No mail-provider credentials/configuration or deployed callback-origin validation was available. | Open: provider adapter is opt-in and fails closed; validate domain, DNS, sender, TLS, and secret rotation in staging. |
| SEC-016 | Medium | Node 26 available while package supports Node 22 only; test harness fails before assertions. | Open: rerun all checks in supported Node 22 CI. |
| SEC-017 | Medium | Production HSTS, CSP, proxy upload limits, and deployed headers are unverified. | Open: hosting owner must validate domain/TLS and staging compatibility before rollout. |
| SEC-018 | High | User create/update accepted role IDs with only user create/update permissions. | Remediated in source: role assignment now also requires `ROLE_UPDATE`; verify least-privilege role policy in integration tests. |

No cleanup candidate has been deleted. See [CLEANUP_CANDIDATES.md](../cleanup/CLEANUP_CANDIDATES.md) and [DELETION_MANIFEST.md](../cleanup/DELETION_MANIFEST.md).
