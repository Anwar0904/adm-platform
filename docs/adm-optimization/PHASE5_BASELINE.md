# Phase 5 baseline and evidence

**Verified source baseline:** `629f0421bfc3a2755aa1545c8d82c54a2b6ec6c1` (`main`, 19 November 2026).
**Working copy:** local changes are uncommitted on `main`. `.git` does not permit creating refs or the index lock, so no Phase 5 branch or commit is claimed. A review patch and file manifest are supplied.
**Production/deployment SHA:** not independently verified. No production host, deployment console, or staging database was accessed.

## Reference CI run

[GitHub Actions run 44542872266](https://github.com/Anwar0904/adm-platform/actions/runs/44542872266) used baseline SHA `629f0421...`:

| Job | Result and evidence |
|---|---|
| TypeScript and unit tests | PASS on Node 22.23.4 / npm 10.9.9. `npm ci`, typecheck, and 39 tests passed across 13 discovered test files. |
| Production build | FAIL during page data collection for `/api/auth/logout`; production env validation rejected development JWT defaults. Compilation and TypeScript had succeeded. |
| ESLint | FAIL: 93 errors, 78 warnings. Error counts: unescaped JSX entities 38, empty object types 26, explicit `any` 19, setState in effect 10. |
| Dependency audit | FAIL: critical Mongoose advisory; affected range reported through 9.11.3. |

Reference run job IDs: tests `135625588755`, audit `135625589176`, build `135625589313`, lint `135625589334`.

No new GitHub Actions run was triggered because source control is read-only from this checkout. The production state remains **unverified**; this document makes no uptime, SEO, performance, or deployment claim.
