# Phase 6 release gates

| Gate | Status | Evidence / next action |
|---|---|---|
| Starting source baseline | PASS | Clean `main` at `8f1c2deedb4dbbaecbef0b9922b8e6e0b5776a39` before edits. |
| Protected portfolio GETs | PASS in source / test execution pending | All three GETs use shared `portfolio.read` guard and no-store behavior. Run tests in Node 22 CI. |
| Explicit proof approval/revocation | PASS in source / role/staging test pending | New `portfolio.approve` permission and strict endpoint; no non-super-admin role is auto-granted the permission. Verify role assignment and revoke behavior in synthetic staging. |
| Public draft/unapproved suppression | PASS in source / DB integration pending | Public list, detail, and homepage portfolio queries require approved metadata. Existing records are not approved. Verify in synthetic staging fixtures. |
| CMS status contract | PASS in source / browser workflow pending | Admin submits lowercase enum values; display labels are separate. Verify create/edit/publish/draft/archive in staging. |
| Useful zero-work portfolio page | PASS in source | Honest fallback and four capability paths; no fake case cards or dead load-more control. Browser visual checks pending. |
| Working filter behavior | PASS in source / browser test pending | Search and category/industry/technology/capability filters intersect over eligible records; clear/empty states exist. |
| Typecheck | PASS locally on unsupported Node 26 | Must rerun under required Node 22. |
| ESLint | PASS, 0 errors / 78 warnings | Warnings are repository-wide; confirm under Node 22 CI. |
| Unit tests | BLOCKED | Current Node 26 `tsx` startup fails before assertions (`uv_os_get_passwd returned ENOMEM`). Run the suite under Node 22. |
| Production build | PASS under Node 26 | 70 static routes generated and `/portfolio` confirmed dynamic. Re-run under Node 22 CI. |
| Local HTTP smoke | PASS | `curl.exe` returned 200 for `/`, `/robots.txt`, `/sitemap.xml`, `/about`, `/contact`, and `/industries`; `/portfolio` intentionally not called to avoid querying configured CMS data. |
| `npm ci` | BLOCKED by toolchain mismatch | Install/use clean Node 22, then run `npm ci` and the four required commands. |
| HTTP/canonical/deployment parity | BLOCKED | Direct hosts could not connect; obtain dated GET/HEAD evidence and provider deployment SHA. |
| Visual/accessibility/forms/staging | BLOCKED | Run desktop/tablet/mobile, keyboard/reduced-motion, synthetic form, DB healthy/outage, and role tests in authorized staging. |
| GitHub CI on implementation commit | BLOCKED | No implementation commit/push was made; `gh` is unavailable. Run four-job Actions on review branch after Node 22 checks and review. |
| Owner proof/contact/legal decisions | OWNER | Approve per-record proof/consent, contact identity, exact legal entity and privacy details before restoration/release. |

**Release decision: HOLD.** Source work is implemented, but tests/build on the supported Node version, CI for an implementation commit, staging role/content checks, production host/deployment identity, and owner approvals remain open. This is not a production-readiness claim.
