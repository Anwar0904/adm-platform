# Phase 5.1 CI evidence

## Local checks after changes

| Command | Result |
|---|---|
| `npm run typecheck` | PASS, exit 0 on local Node 26.13.0. |
| `npm test` | PASS, 48 passed / 0 failed across 15 discovered test files. Local Node 26 cannot call `os.userInfo()` in this sandbox, so the run used a temporary external `NODE_OPTIONS` shim for that call only. It did not modify repository code; this is not a clean Node 22 result. |
| `npm run lint -- --format json` | PASS, exit 0; 0 errors / 78 warnings. No lint rule was disabled. Warnings remain primarily `import/no-anonymous-default-export`, `<img>` optimization, unused declarations, and one React Hook Form compiler incompatibility. They were not bulk-refactored. |
| `npm audit --audit-level=high` | Not passed on the updated source because dependencies remain unchanged and the npm registry request from this environment timed out. The Phase 5 CI audit remains a confirmed failure. |
| `npm ci`, `npm ls mongoose`, `npm run build`, static HTTP smoke | Not rerun in a clean Node 22 environment. The existing Phase 5 CI Node 22 build/smoke is baseline evidence only. |

Local `node --version` is `v26.13.0`, while `.nvmrc` and `engines` require Node 22. No Node 22 binary/version manager was available. The temporary test shim addresses the sandbox `os.userInfo()` issue only; it does not substitute for Node 22 compatibility verification.

## Dependency audit — BLOCKED

The exact Phase 5 Actions audit log reports Mongoose 9.0.0–9.11.3 and these advisories: [GHSA-gg4r-jv3p-qx3c](https://github.com/advisories/GHSA-gg4r-jv3p-qx3c), [GHSA-pcrw-h46h-c93h](https://github.com/advisories/GHSA-pcrw-h46h-c93h), [GHSA-wr5m-5jph-8m96](https://github.com/advisories/GHSA-wr5m-5jph-8m96), [GHSA-8332-j7wj-wjw4](https://github.com/advisories/GHSA-8332-j7wj-wjw4), [GHSA-6972-9mcm-vhwj](https://github.com/advisories/GHSA-6972-9mcm-vhwj). Advisory metadata identifies 9.11.4 as the fixed floor for the reported set; npm currently lists 9.12.2, but this environment could not reach the npm registry to resolve and validate that package. Sources: [GitHub advisory](https://github.com/advisories/GHSA-gg4r-jv3p-qx3c), [official npm versions](https://www.npmjs.com/package/mongoose?activeTab=versions).

`package.json` and `package-lock.json` are unchanged. No lockfile was hand-edited. Complete the upgrade in a clean Node 22, registry-connected checkout, then record `npm ci`, `npm ls mongoose`, `npm audit --audit-level=high`, and DB/model compatibility evidence. Until then, audit remains **FAIL/BLOCKED** and release remains NO-GO.

## No new GitHub Actions run

This checkout's `.git` ref store is read-only, so no branch was pushed and no new workflow run can truthfully be reported. The implementation patch is checked against the exact baseline SHA and requires a new reviewed branch/Actions run from a writable clone.
