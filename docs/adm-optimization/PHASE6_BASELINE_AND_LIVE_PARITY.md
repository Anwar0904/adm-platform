# Phase 6 baseline and live parity

**Audit date:** 20 November 2026 (client time)  
**Starting commit:** `8f1c2deedb4dbbaecbef0b9922b8e6e0b5776a39`  
**Starting branch/worktree:** `main`, clean, tracking `origin/main` at the same commit before Phase 6 edits.

## Repository and CI baseline

- The starting SHA matches the audit baseline supplied in the Phase 6 request. Existing user changes were not present.
- The repository contains Next.js 16.4.5, React 19.2.4, and requires Node `>=22 <23` (`package.json`). The execution environment has Node 26.13.0; no Node 22 installation or `gh` executable is available.
- Existing commands are `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`. The test runner discovers `src/**/*.test.ts`.
- Run `44570233696` on the starting SHA with four green jobs is supplied by the user prompt. GitHub could not be queried from this environment, so that record is treated as supplied baseline evidence, not independently reverified.

## Public route inventory (source)

The public route group provides `/`, `/services`, `/services/[slug]`, `/portfolio`, `/testimonials`, `/industries`, `/about`, `/about/[slug]`, `/blogs`, `/blogs/[slug]`, `/contact`, `/consultation`, `/careers`, `/careers/[slug]`, `/faqs`, `/cookies`, `/privacy-policy`, `/terms`, and leadership/governance pages under `/about/leadership-governance/`. Core metadata routes are `/robots.txt`, `/sitemap.xml`, and `/cms-sitemap.xml`.

The JSON public CMS surface includes `/api/public/portfolio` and `/api/public/portfolio/[slug]` plus public services, blogs, industries, testimonials, pages, home, contact, and consultation endpoints. The admin portfolio surface is `/api/portfolio`, `/api/portfolio/[id]`, and `/api/portfolio/stats`.

## Live parity evidence and limits

- Direct `Invoke-WebRequest` GET attempts for the apex and `www` hosts, homepage, named public pages, robots, and both sitemaps failed with `Unable to connect to the remote server`. Direct headers/status/content-type and apex/www redirects are therefore **not verified**.
- Browser automation and production deployment-provider credentials were unavailable. No desktop/tablet/mobile DOM or screenshots, production deployed SHA, CDN/ISR evidence, or staging database evidence were collected.
- The web crawl result for `/portfolio` contains legacy fabricated-looking examples, metrics, testimonials, and contact placeholders and says it was crawled last month. It is a dated crawler snapshot only. It does not prove that the current host serves that source, nor establish stale-cache versus deployment drift.
- The source at the starting SHA has `portfolioEvidence: false`, and its `/portfolio` page rendered a one-paragraph fallback. The Phase 6 source now renders approved CMS records or the honest process/capability fallback. Production parity remains unknown until a direct, dated request and deployment SHA are available.

## Outcome

Source baseline and routes: **PASS**. Production host, redirects, live body parity, deployment SHA, screenshots, Search Console, and production/staging database state: **BLOCKED / unverified** due network and credential/tool limits. No production-readiness claim is made.
