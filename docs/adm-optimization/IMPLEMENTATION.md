# ADM optimization implementation

## Changes in this iteration

- Removed the root-level homepage canonical from `src/app/layout.tsx`, so routes without a page canonical no longer inherit `/`. Kept the existing homepage canonical in `src/app/(public)/page.tsx`.
- Replaced direct unverified “global company” copy in home, about, service, careers and sustainability locations with capability language. Updated root Open Graph and X/Twitter copy to use the approved tagline and Technology, Marketing, AI and Data.
- Added route-specific title, description, Open Graph URL and canonical metadata to the company, services, blogs, portfolio, industries, testimonials, FAQs, contact, consultation, governance and legal pages.
- Added a canonical and explicit indexability to published CMS service/blog records. Missing blog records return `noindex`; their route continues to 404. Removed the blog author Open Graph URL pointing at missing `/team`.
- Added `noindex` for the complete admin route segment, including login, while retaining existing auth protection and robots disallow rules.
- Rebuilt sitemap generation around `src/lib/seo/sitemap.ts`. It now lists implemented public routes, adds only published blogs/services, avoids duplicate URLs, excludes absent portfolio/industry detail templates and `/team`, and omits static `lastModified` values. CMS last-modified values use a parseable `updatedAt` only; `createdAt` is not treated as an edit date.
- Corrected the footer’s broken `/team` link to the existing `/about/leadership-governance` page and updated the label.
- A phone number in `src/components/layout/Footer.tsx` changed after the initial clean-worktree inspection. That concurrent workspace change was preserved and was not part of this implementation; the footer phone/email still need owner verification against the contact page.
- Added focused sitemap unit tests at `src/lib/seo/sitemap.test.ts`.

No palette, typography, page-section order, forms, CMS records, auth/session behavior or admin routes were changed. Existing project case studies, testimonials, legal copy, contact values and analytics behavior remain in place pending approval. The existing design was not visually changed, so before/after screenshots and visual comparisons are not applicable to this code batch.

## Verification

- Installed Next.js 16 docs were consulted before changing metadata and sitemap conventions.
- Final `tsc --noEmit`: passed (`TSC_EXIT=0`).
- Sitemap tests: compiled the two TypeScript files into a temporary CommonJS output and ran `node --test`; 3 passed, 0 failed. The generated output was removed after validation.
- `npm test` / the configured `tsx --test` runner is blocked before test discovery by Node 26 `uv_os_get_passwd` / `ENOMEM`. The focused tests passed through the direct TypeScript compile/runtime path above.
- Targeted ESLint passed for the new metadata/sitemap/admin files. The wider touched-file lint reports 4 existing `no-explicit-any` errors and 2 warnings in `src/app/(public)/services/[slug]/page.tsx` and `src/app/(public)/portfolio/page.tsx`; those usages/imports are outside the changed lines. A full `npm run lint` invocation did not return a result through this shell.
- Production build: ran `npm run build` with `ADM_NEXT_DIST_DIR=.next-adm-optimization` to isolate output from `.next`. Next produced `BUILD_ID`, route/prerender manifests and reached static generation. The output was checked and then removed; the shell wrapper did not return a final exit code. This build preceded the final copy-only edits and `updatedAt`-only sitemap refinement; those later changes passed TypeScript and focused sitemap checks but were not rebuilt.
- Production host/redirect checks failed in the web access tool; canonical host and www/non-www behavior remain unverified. Current local `SITE_URL` setting remains the source of canonical URLs.
- MongoDB records and route HTTP status were not inspected. Sitemap dynamic content behavior is validated at the pure helper level only; production URL presence/status is unverified.
- No production URL HTTP checks, browser screenshots, SEO crawl, schema validator, Search Console, analytics or field Core Web Vitals were available. No measurements are claimed.

## Preserved behavior and known limitations

- The careers route still uses `CAREERS_CANONICAL_URL`, currently derived from local `SITE_URL`.
- Sitemap still degrades to static routes if MongoDB fails, as before. Dynamic CMS coverage is limited to blog/service routes that have implemented page templates.
- Public claim verification is an owner/legal task described in `CLAIMS_REVIEW.md`. No fake projects or social proof were silently removed or reclassified.
- Git branch creation was attempted but failed because workspace permissions make `.git` read-only. Changes are on the checked-out `main` worktree; no commit was created.

## Phase 2 completion update — 18 November 2026

The follow-up implementation fixed duplicate title suffixes on portfolio, industries, contact, consultation, FAQs and testimonials; changed the global navbar logo from H1 to a non-heading element; fixed FAQ links to `/faqs`; and removed links from portfolio/industry cards to detail routes that do not exist. The cards and underlying claim content remain unchanged pending owner approval. Details, audit evidence and the release decision are in `PHASE2_COMPLETION.md`.

The final isolated Next production build passed and generated 70 pages; TypeScript passed; the focused sitemap tests passed 3/3; the fixture audit passed; and targeted ESLint passed with two existing warnings. Full lint was run and exited 1 with 93 errors and 78 warnings. The configured `npm test` runner still fails before test discovery with Node 26 `uv_os_get_passwd returned ENOMEM`. The local post-fix crawl has 8 HIGH timeouts including `/sitemap.xml` and multiple database-backed pages. These results keep release at NO-GO; this crawl is not production verification.
