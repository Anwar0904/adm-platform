# Phase 5 staging, sitemap, and SEO evidence

## Source changes

- Static `/sitemap.xml` remains in `src/app/sitemap.ts` and does not access MongoDB.
- CMS `/cms-sitemap.xml` now collects all available published blog/service pages in batches of four, with a 1,000-record page size. A 50,000 URL ceiling is enforced; incomplete or over-limit results fail rather than returning a partial 200. Open careers are read with a 50,001 cap to detect overflow.
- Career dates and content dates are checked before XML serialization. Invalid and out-of-range dates are omitted. Slugs with path/query/fragment separators are excluded; safe slugs are percent-encoded, and XML text is escaped.
- Sitemap tests cover career dates/slugs, XML escaping, 2,501 records across pages, and incomplete page rejection.
- `scripts/verify-static-seo.py` is wired into CI to test static routes over HTTP after build.

## Evidence status

The static HTTP smoke, healthy/unavailable staging DB behavior, publication-set completeness, withdrawn-record removal, real response timings, and 404-versus-503 detail-route behavior are **not measured** in this checkout. The local test command discovered 15 files but Node 26 failed in `tsx` setup before executing tests. No staging credentials were supplied or used.

No browser screenshots, form exercises, accessibility audit, structured-data review, canonical-host crawl, Search Console review, Lighthouse lab data, or CrUX field data were collected. No score or production SEO claim is made. These remain staging/owner-dependent release gates.

## Rollback

Revert the dynamic sitemap route, career repository/service limit option, pagination helper, sitemap date handling, and its tests as a unit if staging shows incompatible pagination results. Keep the DB-independent static sitemap and its robots advertisement available.
