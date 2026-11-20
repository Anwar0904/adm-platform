# Phase 6 implementation record

## Source changes

- Protected list, by-ID, and stats reads with `portfolio.read`; preserve role-based write permissions and mark admin responses private/no-store.
- Added optional default-pending proof metadata to the Portfolio schema/type and shared eligibility/query/URL helpers. Public list, detail, and homepage portfolio reads now require the approval contract and use field-limited DTOs; public portfolio failures distinguish 400, 404, and 503. Added a `portfolio.approve` protected endpoint for explicit owner-approved publishing/revocation.
- Converted the admin portfolio status contract to lowercase `published` / `draft` / `archived`, with display labels separate from submitted values.
- Replaced the binary `/portfolio` gate with a server-side approved-record page and real local filters for search, ADM capability, category, industry, and technology. Removed the old unverified proof sections from the route. Approved details expand accessibly; empty and CMS-unavailable states include capabilities, process, and a consultation CTA.
- Marked the CMS-backed portfolio page as force-dynamic per the installed Next 16 route-segment docs; the first build exposed static prerendering when its database fallback was caught.
- Removed visible unsupported metrics and response-time/global-operation claims from contact, consultation, and industries pages; disabled contact methods/location blocks whose identity values lack owner approval; replaced sample company video playback with a neutral ADM-branded capability visual; redirected legal contact copy to the working contact form.

## Compatibility and rollback

- Database change is additive only; no production schema/data migration, backfill, seed, or record edit occurred. Missing proof metadata is default-deny. Rollback must preserve public filters/DTO or keep the entire portfolio hidden; reverting only the schema while retaining published queries could re-expose records.
- CMS reads/writes retain current route shapes and canonical enum values. No public detail page was introduced. Core sitemap route availability and existing URL structure are preserved in source.
- Exact changed-file list: [PHASE6_CHANGED_FILES.md](./PHASE6_CHANGED_FILES.md). No commit, push, deployment, or PR is claimed.

## Checks

| Check | Result |
|---|---|
| `npm run typecheck` | PASS on the local Node 26 environment; repository requires Node 22. |
| `npm run lint` | PASS, 0 errors / 78 warnings. Warnings are existing repo-wide lint findings; rerun in Node 22 CI. |
| `npm test` | BLOCKED: Node 26 `tsx` worker startup fails at `os.userInfo()` with `uv_os_get_passwd returned ENOMEM`, including serial invocation. No app assertions executed. |
| `npm run build` | PASS under Node 26. Next generated 70 static pages; `/portfolio` was dynamic (`ƒ`) and the new approval route compiled. This does not replace a Node 22 CI run. |
| `npm ci` | Not run: only Node 26 is installed, whereas `package.json` requires Node 22. Avoided replacing the working dependency tree with an unsupported-runtime install. |
| HTTP/canonical/screenshots | BLOCKED: production host requests cannot connect from this environment; no browser screenshot tooling or staging credentials available. |
| GitHub Actions | Not launched: no `gh` CLI or implementation commit. Starting SHA CI result supplied in prompt only. |

## Owner/staging actions

Owner/content approver must review individual portfolio evidence and consent, populate approval metadata through a controlled workflow, and verify contact/legal identity. Staging must validate admin role flows, approved/unapproved records, forms, media, browser responsiveness, reduced-motion behavior, and outage responses before deployment.
