# Phase 4 baseline

## Repository snapshot

- Baseline commit: `9f2ae626d6f73a9c04da9a7d5d6a66072cd082a5` (`main`, 19 November 2026).
- Initial worktree: clean. Branch creation for `phase4/trust-reliability-brand` failed because `.git/refs` is read-only in this workspace. No reset, remote change, commit or merge was attempted.
- Runtime: Node `v26.13.0`; npm `12.2.1` (`npm.cmd`). `.nvmrc` did not exist at baseline.
- Initial `npm.cmd test`: exit 1 before test discovery. `tsx` crashed in `os.userInfo()` with `uv_os_get_passwd returned ENOMEM`. The new explicit discovery script finds 13 `*.test.ts` files (including existing tests that `rg --files` omitted due ignore rules); Node 26 still fails before test code loads.
- `npm ci` was attempted after implementation. It exited 1 with `ENOTEMPTY` while removing `node_modules/next/dist/api`, which was in use. Follow-up online and offline install attempts stalled and were cancelled; node_modules command shims are now incomplete. Typecheck, lint and build could not be rerun after this environment failure. No baseline screenshot capture was available. Historical screenshots and local crawl evidence are described in `PHASE2_COMPLETION.md` and are not new Phase 4 measurements.

## Route and source inventory

The public route tree is in `src/app/(public)`. Routes backed by published CMS records include `/blogs/[slug]`, `/services/[slug]`, `/careers/[slug]`, and governance pages backed by active team records. Static routes include `/`, `/about`, `/about/leadership-governance`, `/about/sustainability`, `/services`, the four pillar routes, `/portfolio`, `/industries`, `/blogs`, `/careers`, `/contact`, `/consultation`, `/faqs`, `/testimonials`, `/privacy-policy`, `/terms`, and `/cookies`. The catch-all `/about/[slug]` returns 404; no portfolio or industry detail template exists.

At baseline `src/app/sitemap.ts` awaited the incoming request connection, attempted MongoDB and queried blogs, services, and careers before returning the static URL list. The Mongo connection has a 5-second selection/connect timeout. Previous Phase 2 local audit evidence records the sitemap and several DB-backed routes timing out while MongoDB was unavailable. Those historical results are not a new staging or production outage measurement.

## Environment and evidence limits

- `.env.local` exists but was not read. No DB credentials, production data, or personal inquiries were accessed.
- No staging database, production host response, deployment SHA, Search Console, analytics, browser session, or approval evidence was supplied.
- No form submission, production DB access, deployment, migration, external message, or screenshot comparison was performed.
- Next.js 16.4.5 local metadata route docs (`sitemap.md`, `robots.md`) and Route Handler docs were read before changing sitemap behavior.
