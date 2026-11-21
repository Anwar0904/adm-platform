# Portfolio release gates

## Local implementation status

- Component and public-data audit: complete; see `PORTFOLIO_COMPONENT_DECISIONS.md`.
- Portfolio experience implementation: site-alignment updates are in the current worktree; no commit, PR, push or deployment was created.
- Starting checkout was `main` at `8b924efdc123b0c9d3464f826be80e70574f2b45`. Creating `design/portfolio-site-alignment` failed because Git could not write `.git/refs`; `.git` is read-only in this workspace. Changes remain uncommitted on `main` for review; no permissions were bypassed.
- Approved-public record policy: preserved; no database writes or seed actions performed.
- Screenshots: not captured; see `PORTFOLIO_VISUAL_QA.md`.
- CI URL / current deployed SHA: not verified in this session. Do not treat the supplied prompt's historical GitHub/live observations as current production evidence.

## Commands and results

For the site-alignment pass, `npm.cmd run typecheck` passed, `npm.cmd run build` passed with `/portfolio` compiled as a dynamic route, and `npm.cmd run lint` passed with 0 errors and 78 warnings. Targeted ESLint for the portfolio experience and route passed without warnings. Build used Node 26.13.0, outside the project's `>=22 <23` engine range. `npm.cmd test` discovered 21 files, but all failed before assertions when Node 26 `tsx` startup called `os.userInfo()` and received `uv_os_get_passwd returned ENOMEM`. Node 22 and browser screenshots are unavailable here, so `npm ci` and browser QA were not run. `git diff --check` passed with LF-to-CRLF warnings. The earlier local public-route smoke check deliberately omitted DB-backed `/portfolio`.

Re-run quality checks under Node 22. Also run auth/privacy tests, responsive screenshots at the README's target widths, keyboard/axe checks, and staging-safe DB tests before release.

## Release decision: NO-GO

The implementation is reviewable locally but is not release-ready. Required remaining gates: supported Node 22 CI and all quality jobs passing on the final commit; screenshot review at desktop/tablet/mobile for empty, outage and approved fixture states; accessibility/link and image review; staging verification of public/admin API permissions; owner evidence approval for each project record; production canonical/deployment SHA verification; and a rollback plan confirmed against the chosen release process.

No production release or rollback action was performed. Keep the existing feature gate for homepage portfolio proof off until approved content and the owner release decision are confirmed.
