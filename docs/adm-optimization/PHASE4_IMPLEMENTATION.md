# Phase 4 implementation record

## Scope and current result

Implemented the first safe-release foundation changes and selected reversible trust/brand improvements. No deployment, DB migration/write, form submission, external message or merge was performed. Measurements and command results will be recorded below after the local checks; this is not a release approval.

## Changed files

| File | Change and reason | Rollback |
| --- | --- | --- |
| `src/app/sitemap.ts` | Returns the core static URL set synchronously without request connection or MongoDB. | Restore previous function after review; keep the dynamic sitemap endpoint if still desired. |
| `src/app/cms-sitemap.xml/route.ts` | New uncached CMS sitemap. Queries published content and live career records; returns 503/Retry-After when current DB state cannot be verified. | Remove endpoint and its robots reference together. |
| `src/lib/seo/sitemap-content.ts` | Validates record shapes, filters published blog/service slugs, deduplicates URLs, and serializes escaped XML. | Remove with CMS sitemap route. |
| `src/app/robots.ts` | Advertises both static and CMS sitemap URLs. | Restore single sitemap URL if dynamic sitemap is removed. |
| `src/lib/security/seed-route-policy.ts`, `src/app/api/seed/roles/route.ts` | Extracts the existing production 404 policy into a pure testable helper; behavior remains 404 before DB access in production. | Inline policy and remove helper/tests. |
| `src/lib/security/seed-route-policy.test.ts`, `src/lib/db-uri-candidates.test.ts`, `src/lib/seo/sitemap.test.ts` | Test production role seed policy, production URI fallback exclusion and sitemap filtering/static entries. | Remove only if replaced by equivalent coverage. |
| `scripts/run-tests.mjs`, `package.json`, `package-lock.json`, `.nvmrc` | Pin Node 22, add typecheck script, explicitly discover/report all `src/**/*.test.ts`, and fail if discovery is empty. | Restore package scripts/runtime pin after replacement runner is approved. |
| `.github/workflows/quality.yml` | Adds separate CI jobs for typecheck/tests, lint, production build and npm audit, without DB secrets. | Remove workflow after equivalent gates are in place. |
| `src/components/home/hero/Hero.tsx` | Uses the mandate's draft four-pillar copy, preserves imagery and CTAs, removes unverified hero logos/proof, and displays the approved tagline. | Restore prior copy/proof only after evidence and permission are recorded. |
| `src/config/company-contact.ts`, `src/components/layout/Footer.tsx` | Unknown contact/social identity remains empty; footer hides invalid email and unverified social links, links to the contact form, and points capability links to the four pillars. | Restore reviewed footer fields only with owner-confirmed values. |
| Phase 4 docs | Baseline, trust register, owner questions, implementation and release gates. | Retain as audit trail; update states with evidence rather than deleting. |

## Measurements

| Check | Before | After |
| --- | --- | --- |
| `npm.cmd test` on Node `v26.13.0` | Exit 1 before discovery: `tsx` failed in `os.userInfo()` (`uv_os_get_passwd returned ENOMEM`). | Updated runner explicitly found 13 files, then all 13 failed before test code loaded with the same Node 26/tsx error. No false pass was reported. Node 22 is pinned for CI; unavailable locally. |
| `npm ci` | Not run at initial snapshot. | Exit 1: `ENOTEMPTY` while removing `node_modules/next/dist/api`. Online/offline dependency repair stalled and was cancelled; `.bin` command shims are incomplete. |
| `npm run typecheck`, `npm run lint`, production build | Not run at initial snapshot. | Not run after the clean-install attempt because TypeScript, ESLint and Next CLI shims were missing. This is an environment/setup blocker, not a passing result. |
| `git diff --check` | Not captured at initial snapshot. | Pass; Git reports only expected LF-to-CRLF working-tree conversion warnings for edited TypeScript files. |
| Package manifest JSON parsing | Not captured at initial snapshot. | Pass for `package.json` and `package-lock.json` using Node's JSON parser. |
| Core sitemap DB dependency | Awaited request connection and MongoDB query path before returning static URLs. | Synchronous static route no longer imports or calls DB services. Local HTTP and outage measurement pending. |
| Hero copy/proof | Technology/AI/software-focused and unverified “Trusted by growing brands” names. | Four capabilities in opening copy; hero proof strip removed; tagline preserved. |
| Footer identity | Malformed inbox, unconfirmed phone/address and generic GitHub link rendered. | Unknown identity omitted; `/contact` remains available. |

## Tradeoffs and known limits

- Dynamic sitemap is deliberately `no-store`: this avoids stale published URLs after withdrawal but requires a live DB for CMS discovery. During DB outage, crawlers still get the static sitemap and the dynamic sitemap gives a non-cached 503.
- No staging DB exists here to prove healthy dynamic URL output, withdrawn-record freshness, or the outage status. Historical 5-second Mongo server selection/connect bounds remain in `src/lib/db.ts`.
- Hero/social cleanup is limited to hero and footer. Other proof on homepage, portfolio, testimonials, governance, contact and legal pages remains pending owner evidence and is tracked in the trust register.
- Changing footer capability links establishes the four pillar paths. It does not prove specialist CMS pages are healthy or that every capability page has sufficient content.
- CI lint is expected to expose existing repository debt; rules were not disabled. Browser, accessibility, form, production SEO, and field CWV checks remain unrun.
