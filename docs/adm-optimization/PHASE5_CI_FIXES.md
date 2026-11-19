# Phase 5 CI fixes and remaining dependency blocker

## Implemented

- Production build job has clearly synthetic, CI-only values for the public origin, JWT validation, and unreachable MongoDB URI. No runtime validation was relaxed and no real secret was added. The artifact must not be promoted as a production build.
- The workflow's smoke step now invokes `scripts/verify-static-seo.py` against the started application. It verifies prompt 200 responses, robots and sitemap media types, both advertised sitemap locations, XML parseability, configured canonical origin, and exclusion of routes known not to exist.
- The `98% Organization Satisfaction` hero card was replaced with non-quantified `Data Insights / Informed Decisions` content.
- Seed execution now stops before importing or connecting to the database. See [security and data safety](PHASE5_SECURITY_AND_DATA_SAFETY.md).

## Validation

- `npm run typecheck`: exit 0 on the local Node 26 environment after implementation.
- `npm run lint -- --format json`: exit 1; **2 errors and 79 warnings** remain. The initial verified CI count was 93 errors and 78 warnings. JSX escaping, empty object type declarations, and state-in-effect errors are resolved. The remaining errors are the generic repository `any` contracts in `src/repositories/base.repository.ts` and `src/repositories/blog.repository.ts`; the Mongoose type changes tried locally altered inferred query/document behavior, so those contracts were restored rather than hidden behind casts.
- `npm test`: exit 1 before test modules executed. Node 26's `os.userInfo()` fails with `uv_os_get_passwd returned ENOMEM` inside the installed `tsx` temporary-directory setup. The mandate identifies clean Node 22 as canonical; Node 22 is not installed in this environment. The new tests have not been recorded as passing.
- A new build, audit, and static HTTP smoke run were not completed locally. No new Actions run exists.

## Mongoose advisory — BLOCKED

The lockfile and manifest remain unchanged. The Phase 4 CI run reported advisories through Mongoose 9.11.3; advisory metadata consulted during this task identifies 9.11.4 as the patched floor for the reported 9.x issues: [GHSA-gg4r-jv3p-qx3c](https://github.com/advisories/GHSA-gg4r-jv3p-qx3c), [GHSA-pcrw-h46h-c93h](https://github.com/advisories/GHSA-pcrw-h46h-c93h), [GHSA-wr5m-5jph-8m96](https://github.com/advisories/GHSA-wr5m-5jph-8m96), [GHSA-8332-j7wj-wjw4](https://github.com/advisories/GHSA-8332-j7wj-wjw4), and [GHSA-6972-9mcm-vhwj](https://github.com/advisories/GHSA-6972-9mcm-vhwj). The npm registry could not be reached from the local shell, so a registry-generated lockfile, clean `npm ci`, resolved dependency audit, and integration compatibility check could not be validated. No hand-edited lockfile, audit suppression, or force upgrade was used. Resolve this in a Node 22 environment with registry access before release.

## Rollback

Revert the Phase 5 workflow and smoke-script changes together to restore the previous CI behavior. Restore the hero card only after evidence and owner approval; the current replacement contains no metric.
