# ADM optimization baseline

## Scope and evidence

Inspected the repository at commit `cd2face87082e0ffee2de87757af2147ea2312a0` on 18 November 2026. The working tree was clean before this task. The requested Git branch could not be created because `.git` is read-only in this workspace. The production host, redirects, Search Console, analytics account, MongoDB content and production HTTP status codes were not accessible; they remain unverified.

Project rules read: `AGENTS.md`, `.github/skills/grounded-coding-workflow/SKILL.md`, `README.md`, `SECURITY-REVIEW.md` and `RESPONSIVE_DESIGN_GUIDE.md`. Installed dependencies report Next.js 16.4.5, React 19.2.4, TypeScript 5, Tailwind CSS 4 and Mongoose 9.7.4 (`package.json`). Before metadata changes, the installed Next.js 16 docs at `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` and the sitemap/robots file-convention docs were read.

Pre-change test/lint/build outputs were not captured. The source inventory below reflects the clean pre-change commit; post-change check results are recorded separately.

## Framework and checks

Scripts in `package.json`: `dev`, `build`, `start`, `lint`, `test` and `seed`. Tests use `tsx --test`; no separate typecheck script is configured. Existing test files include auth/session, validators, database, public content, leadership and team coverage. `SECURITY-REVIEW.md` documents resolved sliding-session issues, a refresh-response-loss edge case and missing MongoDB/auth integration coverage. It also records a prior build limitation caused by a shared `.next` directory.

This checkout contains `.env.local`; its values were not read. Shell environment checks did not expose `MONGODB_URI` or `NEXT_PUBLIC_SITE_URL`. Node processes were already running, so the shared `.next` build output was treated as in use. The first focused test attempt failed before loading tests with Node `uv_os_get_passwd` / `ENOMEM`; see `IMPLEMENTATION.md` for follow-up results.

## Routes and templates

Routes are derived from `src/app`, not from an external crawl. Public route group: `src/app/(public)/`.

| Route | Template / data | Local indexing and metadata evidence |
| --- | --- | --- |
| `/` | Home sections assembled in `src/app/(public)/page.tsx` | Explicit title, description, canonical and Open Graph; metadata copy uses the four capabilities. |
| `/about` | Company overview | Explicit title, description and canonical. Company statements and media are in `src/components/about/company-content.ts`. |
| `/about/leadership-governance` | Published active team records, filtered by governance group | Explicit metadata/canonical; names and bios are CMS-backed. |
| `/about/leadership-governance/{leadership-board,executive-committee,management-committee}` | Governance group pages | Metadata is route-specific in each page. Live record availability is unknown. |
| `/about/sustainability` | Static content | Explicit title, description and canonical. |
| `/about/[slug]` | Catch-all placeholder | Always calls `notFound()`; not a real content route. |
| `/services` | Capabilities hub | Explicit metadata and canonical. |
| `/services/{technology,marketing,ai,data}` | Static pillar data in `src/components/services/pillar-services.ts` | Generated metadata and canonical. |
| `/services/[slug]` | Published service CMS record | Generated metadata; canonical uses the record slug. MongoDB availability/content not verified. |
| `/portfolio` | Static portfolio sections/components | Explicit metadata/canonical. No `/portfolio/[slug]` page exists in `src/app`. |
| `/industries` | Static industry sections/components | Explicit metadata/canonical. No `/industries/[slug]` page exists in `src/app`. |
| `/blogs` | Editorial listing components | Explicit metadata/canonical. Listing records come from public content services. |
| `/blogs/[slug]` | Published blog CMS record | Generated metadata and canonical; record lookup filters to published/non-deleted entries. |
| `/careers` | Public career records | Explicit metadata/canonical from `CAREERS_CANONICAL_URL`. |
| `/careers/[slug]` | Published career record | Generated metadata/canonical and JobPosting JSON-LD. |
| `/contact`, `/consultation` | Separate contact and consultation funnels | Explicit route metadata/canonicals; forms call existing public API handlers. |
| `/faqs`, `/testimonials` | Public content sections | Explicit metadata/canonicals. Underlying displayed static/CMS content requires owner verification. |
| `/privacy-policy`, `/terms`, `/cookies` | Static legal content | Explicit metadata/canonicals. Legal text requires legal/owner review. |
| `/team` | No public page file | Not a valid local route. The stale footer link was redirected to the implemented leadership page label/path. |

Admin and API routes live under `src/app/admin/` and `src/app/api/`; authentication is implemented through `src/proxy.ts`, `src/app/admin/layout.tsx` and `src/lib/auth/`. At baseline, admin pages inherited root `index: true` metadata while `robots.ts` disallowed crawling. No separate public `/auth` page was found.

## SEO and content systems

- The root metadata lives in `src/app/layout.tsx`; route metadata lives in individual page files. The root layout previously set the homepage canonical for the entire application. The public homepage already overrode it, while several other routes could inherit it.
- `src/app/robots.ts` allows `/` and disallows `/admin`, `/api`, `/auth`, checkout, JSON paths and query-string paths. These directives are crawl guidance, not access control. Admin/API protection is separate.
- `src/app/sitemap.ts` is a dynamic Next.js sitemap that calls `connection()`, reads published content from MongoDB and falls back to static URLs on database failure. Before this task, it listed non-existent `/team`, `/portfolio/[slug]` and `/industries/[slug]` URLs, omitted implemented pages such as `/cookies` and `/testimonials`, and stamped static routes with the current time.
- No Organization, WebSite, BreadcrumbList, Article or Service JSON-LD was found in the public templates. Career detail has JobPosting JSON-LD. Do not add entity schema until the canonical host, logo and identity references are verified.
- Models and relationships: `Blog` references category, tags, author and media; `Service` references media; `Portfolio` references category, media, services and industries; `Industry` references media and services; `Lead` references services and users; `Consultation` references a lead and users. See `src/models/*.model.ts` and `src/services/public-content.service.ts`.

## Funnel, analytics and reusable components

- Contact form: `src/components/contact/contact-form-section.tsx` → `POST /api/public/contact` → `PublicContentService.submitContact` / lead persistence.
- Consultation form: `src/components/consultation/consultation-request-section.tsx` → `POST /api/public/consultation` → `PublicContentService.submitConsultation`.
- Both handlers validate with Zod schemas in `src/validators/public.validator.ts`. Existing integrations and form persistence are retained.
- `src/app/layout.tsx` mounts Vercel Analytics. `src/lib/analytics.ts` formats non-PII categorical fields. Contact and consultation pages emit existing page-view/submission events. No consent manager was identified, so new tracking was not added.
- Reusable public shell: `src/app/(public)/layout.tsx`, `src/components/layout/navbar/Navbar.tsx`, `src/components/layout/Footer.tsx`. Core page components are grouped under `src/components/home`, `services`, `portfolio`, `blog`, `contact`, `consultation`, `about` and `industries`.

## Initial ranked findings

| Priority | Evidence | Paths | Benefit | Risk / reversible plan |
| --- | --- | --- | --- | --- |
| P0 | Root layout declared a global homepage canonical; several routes did not override it. | `src/app/layout.tsx`, public page metadata | Prevent unrelated public pages from canonicalizing to `/`. | Low; remove global canonical and add explicit route canonicals. |
| P0 | Sitemap declared absent route templates and current-time modification dates; omitted existing routes. | `src/app/sitemap.ts`, public route tree | Keep the XML sitemap aligned to implemented public pages and content. | Low; pure helper with tests, no URL migration. |
| P1 | `/team` was linked from the footer but no public `/team` route exists. | `src/components/layout/Footer.tsx` | Route visitors to the existing governance page. | Low; one internal link/label change. |
| P1 | Static metadata used “global”; footer/contact/legal claims and portfolio/testimonial figures have no verification evidence in the repository. | About/home/portfolio/contact/footer/legal components | Avoid adding unsupported claims; produce concrete approval tasks. | Public business claims are left unchanged pending owner/legal verification. |
| P2 | No mobile/desktop screenshots, browser crawl, Search Console data or Core Web Vitals were available. | Public templates | Capture evidence for later visual/performance decisions. | No visual changes made without comparisons. |
