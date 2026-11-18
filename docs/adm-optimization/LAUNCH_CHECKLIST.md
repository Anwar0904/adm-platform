# ADM optimization launch checklist

## Repository checks

- [ ] Resolve the existing lint errors/warnings recorded in `IMPLEMENTATION.md` after scope review.
- [ ] Re-run `npm test` when the Node `tsx` `uv_os_get_passwd` issue is resolved.
- [x] Run local TypeScript check; `tsc --noEmit` passed in this iteration.
- [x] Run an isolated production build; Next produced build output through static generation.
- [ ] Repeat the isolated production build after the final copy and sitemap timestamp refinements.
- [ ] Verify `/sitemap.xml` and `/robots.txt` output against the deployed route set.
- [ ] Check metadata/canonical for `/`, `/about`, each capability, a published article, `/portfolio`, `/contact`, `/consultation` and `/careers`.
- [ ] Check for JSON-LD validity only where schema is implemented; JobPosting output must match a current visible role.
- [ ] Crawl internal links and check 200/3xx/404 status and redirect chains after production access is available.
- [ ] Capture desktop ~1440px, tablet ~768px and mobile ~390px screenshots for home, capabilities, one service, portfolio, article, about and contact/consultation; compare against the previous experience.
- [ ] Keyboard-check nav, forms, focus visibility and error/success announcements. Check reduced-motion behavior and mobile overflow.

## Owner / external verification

- [ ] Confirm production canonical host, www/non-www redirect, slash policy and `NEXT_PUBLIC_SITE_URL`.
- [ ] Verify domain property and sitemap in Google Search Console; inspect canonical selection and indexability.
- [ ] Review queries, landing pages, performance and conversions from actual Search Console/analytics data.
- [ ] Approve claims listed in `CLAIMS_REVIEW.md`, especially portfolio metrics, client names/logos, testimonials, contact details, social profiles and legal content.
- [ ] Confirm consent and retention rules for Vercel Analytics, lead and consultation records.
- [ ] Test contact and consultation submissions end to end in a non-production/safe environment, including validation, errors, success, database record and authorized notification if configured.
- [ ] Confirm admin login/session behavior against `SECURITY-REVIEW.md`; specifically preserve refresh-response-loss and MongoDB integration gaps as known work.
- [ ] Verify WCAG 2.2 AA issues in a browser and test field Core Web Vitals; record actual results, not Lighthouse-only as field claims.

## Rollback

1. Review `git diff` and revert only the SEO batch files if a regression is found; preserve unrelated worktree changes.
2. No URL migration, redirect rule, database schema change, CMS content edit, auth change or production deployment was made in this iteration.
3. For sitemap regressions, restore the previous `src/app/sitemap.ts` from the reviewed diff while keeping an explicit list of URLs checked against the current `src/app` tree.
4. Re-run the relevant sitemap test and metadata/type checks after rollback or correction.

## Phase 2 status — 18 November 2026

- [x] Isolated production build after Phase 2 edits: passed, 70 pages generated.
- [x] TypeScript and focused sitemap tests: passed; sitemap tests 3/3.
- [x] Kit offline audit self-test: passed.
- [ ] Local sitemap HTTP response and database-backed route availability: unresolved; audit requests timed out while MongoDB was unavailable.
- [ ] Full lint: failed with 93 errors and 78 warnings. Full `npm test`: blocked before discovery by Node 26 `uv_os_get_passwd returned ENOMEM`.
- [ ] Owner approvals: all entries in `OWNER_APPROVALS.csv` remain pending.
- [ ] Production hostname/redirects, Search Console, browser/accessibility, safe form E2E and field Core Web Vitals remain unverified.

The release gate is **NO-GO**. Track the complete evidence and conditions in `PHASE2_COMPLETION.md`.

## Phase 3 status — 18 November 2026

- [x] Production `POST /api/seed/roles` returns 404 before connecting to MongoDB, verified against the isolated production build.
- [x] Production MongoDB connection no longer falls back to localhost; the fallback remains for non-production environments.
- [x] TypeScript, isolated build and focused URI-selection tests pass.
- [ ] Non-production role-seed authorization and the eight CMS/sitemap timeout routes need safe staging database verification.
- [ ] Configured test runner fails before discovery on Node 26 `uv_os_get_passwd returned ENOMEM`; full lint reports 93 errors and 78 warnings. See `PHASE3_LINT_INVENTORY.md`.
- [ ] Owner-approved public inbox/GitHub profile, claims, CMS service URLs and legal content remain pending. Service HTML sanitization needs a content-preserving review.

Release remains **NO-GO**. See `PHASE3_REVIEW.md`.
