# Phase 5.1 baseline

**Starting SHA:** `aa1d7df20889eca0a550d5c4b86e2ffab82b5c74` (`main`, also `origin/main`). The worktree was clean before edits.

Local branch creation was attempted with `git switch -c phase5-1/ci-closure` and failed because `.git/refs/heads` is read-only. No commit or remote ref was created. The deliverable is a patch tested against a clean archive of this exact SHA.

## Phase 5 GitHub Actions evidence

Run [44558187097](https://github.com/Anwar0904/adm-platform/actions/runs/44558187097) checked out the same SHA, used Node 22.23.4/npm 10.9.9, and ran `npm ci` successfully in every job.

| Job | Result |
|---|---|
| TypeScript and unit tests | Typecheck PASS; tests FAIL, 44 passed / 1 failed / 45 total. The failing pagination test expected rejection despite receiving exactly the declared two records. |
| Production build | PASS, 71 pages. Static HTTP smoke PASS: robots 200, sitemap 200, XML with 23 URLs, `application/xml`, 0.009 s. The origin was synthetic `https://adm-ci.invalid`; CMS/database health and the production host were not tested. |
| ESLint | FAIL, 2 errors / 79 warnings. Both errors were `no-explicit-any` in `src/repositories/base.repository.ts` and `src/repositories/blog.repository.ts`. |
| Dependency audit | FAIL, one critical Mongoose entry; installed/resolved range reported as 9.0.0 through 9.11.3 with five listed advisories. |

Job IDs: audit `135679883154`, build `135679883800`, tests `135679883814`, lint `135679883826`.

This baseline contains no staging-database, production-host, deployed-SHA, form-routing, accessibility, CWV, Search Console, or owner/legal approval evidence.
