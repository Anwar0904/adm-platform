# ADM deployment-owner attestation

Complete this form using masked identifiers or yes/no comparisons only. Do not enter secret values, cookies, account addresses, full connection strings, Redis keys, or recovery URLs.

**Security code candidate SHA:** `956c1e832a25ccf859caa8467a482a2ffdc5608c`

**Preview deployment SHA/ID:** `956c1e832a25ccf859caa8467a482a2ffdc5608c` / Vercel status record `EKLy8iVWYizjBBcHv8gsCj66UEH9` (GitHub reports deployment completed; runtime environment is not owner-attested)

**Attesting owner and role:** ____________________
**Date (UTC):** ____________________

Status values: `PASSED`, `FAILED`, `BLOCKED`, `UNVERIFIED`. Attach a sanitized screenshot/export reference or owner-controlled evidence location for each passed item.

| Gate | Status | Masked evidence / reference |
| --- | --- | --- |
| Preview MongoDB cluster/project is dedicated or access-isolated from Production | UNVERIFIED | ____________________ |
| Preview `MONGODB_DB` is explicitly set and its cluster/database target is confirmed isolated from Production | UNVERIFIED | ____________________ |
| Preview DB credential cannot read/write Production | UNVERIFIED | ____________________ |
| Production MongoDB target and least-privilege access are correct | UNVERIFIED | ____________________ |
| Preview and Production Redis are distinct databases/resources | UNVERIFIED | ____________________ |
| Preview and Production Redis tokens and HMAC secrets are separately scoped | UNVERIFIED | ____________________ |
| Redis variables are present in the intended scopes (presence only) | UNVERIFIED | ____________________ |
| Trusted Vercel client-IP header is overwritten by the trusted edge | UNVERIFIED | ____________________ |
| Preview mail goes only to the controlled sink/test recipients | UNVERIFIED | ____________________ |
| Production mail sender/provider are Production-scoped; domain/DNS verified | UNVERIFIED | ____________________ |
| JWT signing secrets are distinct, strong, scoped and rotation state is known (no values) | UNVERIFIED | ____________________ |
| Preview and Production use Node 22 and `NODE_ENV=production` | UNVERIFIED | ____________________ |
| Preview/Production JWT, Mongo, Redis, mail and origin settings are scoped separately | UNVERIFIED | ____________________ |
| HTTPS, Secure/HttpOnly/SameSite cookies, deployed response headers and CSP plan checked | UNVERIFIED | ____________________ |
| Blob token scope, access policy, lifecycle, media edge/body limits and content checks are verified | UNVERIFIED | ____________________ |
| Existing MongoDB media index state reviewed on staging/backup; any migration is separately approved | UNVERIFIED | ____________________ |
| Backup/restore drill, monitoring/alert owner and incident contact are confirmed | UNVERIFIED | ____________________ |
| Last-known-good Production deployment/SHA and rollback owner recorded | UNVERIFIED | ____________________ |
| Rollback procedure and observation window are documented/tested | UNVERIFIED | ____________________ |

## Redis fault-test authorization

Do not test Redis failure against a shared or Production instance. If fault injection is proposed, separately attest:

- The Preview deployment is disposable and does not serve staging users.
- Its Redis fixture is exclusive to this test and contains no required data.
- The deployment owner explicitly authorizes one bounded failure request and restore.
- A recovery/restore owner and time window are present.

**Fault-test authorization:** `BLOCKED` until all four items are confirmed.

**Owner/date:** ____________________
**Evidence reference:** ____________________

## Sign-off

Unverified gates remain open. This attestation does not approve Production configuration changes or release by itself.

**Owner decision:** `PENDING`
**Unresolved items / accepted risks:** ____________________
