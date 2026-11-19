# Phase 5 release gates

**Recommendation: NO-GO.** This source patch is reviewable but is not a technical release candidate or production certification.

| Gate | Status | Evidence / blocker |
|---|---|---|
| Source control | BLOCKED | `.git` is read-only; no branch, commit, PR, or Phase 5 CI run. Patch and changed-file manifest supplied for owner review. |
| Dependencies | BLOCKED | Mongoose manifest/lock unchanged. Registry unavailable; no clean `npm ci` or resolved audit. Phase 4 audit failed on a critical advisory. |
| Types and tests | PARTIAL | Local `npm run typecheck` exit 0. `npm test` discovered 15 files but exited before execution because Node 26 `tsx` setup failed at `os.userInfo()` (`uv_os_get_passwd returned ENOMEM`). Node 22 CI run is required. |
| Lint | FAIL | Whole-repo lint exit 1: **2 errors / 79 warnings**. Remaining errors are `no-explicit-any` in `src/repositories/base.repository.ts` and `src/repositories/blog.repository.ts`. Warnings: `no-img-element` 24, `no-unused-vars` 25, `import/no-anonymous-default-export` 29, `react-hooks/incompatible-library` 1. No rule was globally disabled. |
| Build and smoke | BLOCKED | Workflow now supplies synthetic build-only values and calls the stronger static smoke script. No local build or HTTP smoke pass, and no new Actions run. |
| CMS | PARTIAL | Source pagination/date/outage handling and unit cases added. Healthy staging completeness, 503 behavior, actual published records, and missing-slug behavior were not exercised. |
| Public trust | OWNER-REVIEW | Metric replaced; logo/metric/portfolio/testimonial proof is default-gated. Contact/legal/leadership/service claims still require owner/legal decisions. |
| Funnel | BLOCKED | Contact and consultation delivery, routing, abuse, persistence, and notifications not exercised. No form submitted. |
| Experience / SEO | BLOCKED | CI smoke is implemented but not run. No browser, accessibility, canonical-host, CWV, or Search Console evidence. |
| Deployment | BLOCKED | Production SHA and live host not independently checked; no deployment or production access. |

## Required next evidence

1. In clean Node 22 with registry access: install from lock, update Mongoose manifest and lock to a verified patched release, run high-severity audit, typecheck, tests, full lint, and production build/smoke.
2. Push reviewed changes from an authorized writable clone and link the resulting Actions run; do not promote synthetic build output.
3. Run healthy/outage sitemap and 404/503 checks in authorized staging; exercise forms without real personal data; complete browser/accessibility/SEO checks.
4. Record owner/legal decisions for public proof, contact identity, and legal/privacy language; independently verify deployed SHA and rollback/observability before any GO.

## Rollback map

- CI/smoke: revert `.github/workflows/quality.yml` and `scripts/verify-static-seo.py`.
- Trust gates: revert presentation switches and homepage/portfolio/testimonial usage only after explicit owner decision.
- Seed guard: retain fail-closed behavior; do not roll back to the destructive seed implementation.
- Sitemap: revert dynamic route, pagination helper, career query bound, date handling, and related tests together; keep the static sitemap DB-independent.
