# Phase 4 release gates

Status reflects this repository and environment only. A local pass is not a staging or deployed pass.

| Gate | State | Evidence / remaining condition |
| --- | --- | --- |
| A1 supported runtime, reproducible test discovery | **Partial** | Node 22 pin and explicit test discovery added. Only Node 26.13.0 is installed locally; runner failure before discovery was reproduced. Must pass on clean Node 22 `npm ci && npm test`. |
| A2 lint findings triaged and acceptable | **Blocked** | Phase 3 inventory records 93 errors/78 warnings. Full lint has not been rerun for this baseline. Rules remain enabled. |
| A3 CI quality pipeline, dependency advisory and non-DB smoke | **Implemented, unverified** | Workflow includes install, typecheck, tests, lint, build, robots/sitemap HTTP smoke and `npm audit`; requires a GitHub Actions run to establish actual status. |
| A4 browser, form and screenshot regression | **Blocked** | No Playwright/browser setup or safe form environment was available. |
| A acceptance | **Fail** | Node 22 clean run, zero unacceptable lint findings, CI pass, build and protection tests have not all been demonstrated. |
| B1 route response/latency under healthy DB and outage | **Blocked** | No staging DB or local HTTP deployment measurement. No deliberate production outage. |
| B2 DB-independent core sitemap | **Implemented, local verification pending** | Static metadata route now has no DB imports/calls. Healthy/outage HTTP checks pending. |
| B3 production Mongo fallback and bounded outages | **Protection preserved; partial** | Production fallback selection test added; existing Mongo timeouts are 5 seconds. Deployment/monitoring evidence unavailable. |
| B4 CMS page outage distinction and fault injection | **Blocked** | Dynamic CMS sitemap returns 503 when the DB query fails. Blog/service/career/governance page 404-vs-503 behavior remains unverified and needs fault-injection coverage. |
| B acceptance | **Fail** | Static HTTP availability and healthy CMS URL freshness have not yet been measured. |
| C1 claim inventory | **Partial** | Grouped source inventory created. Full public JSX and CMS row export needs safe CMS read access and a named content owner. |
| C2 reversible visibility control for pending proof | **Partial** | Pending hero proof is suppressed; unapproved claims on other pages and CMS content still need individual approval controls. |
| C3 typed company identity and consistent contacts | **Partial / owner blocked** | Footer uses typed empty approved-contact configuration; contact page/legal values conflict and owner-confirmed canonical identity is absent. |
| C4 legal review worksheet and publication approval | **Blocked** | Owner decisions captured; policy approval/effective facts were not supplied. |
| C trust claims, contact and legal status | **Partial / owner blocked** | Register created; hero proof removed; footer unknown identity hidden. Other claims remain visible pending evidence. Owner decisions listed. Legal pages remain unsigned. |
| C acceptance | **Fail** | Remaining public claims and contact/legal values are not all evidence-gated. |
| D1 four-pillar hero | **Implemented, visual verification pending** | Draft copy is in place; screenshots/browser review unavailable. |
| D2 four pillar paths and meaningful service depth | **Partial** | Hero names pillars and footer links to four existing pillar pages. Scope/deliverables/buyer questions and next-step CTA review remains. |
| D3 safe contact/consultation E2E | **Blocked** | No safe environment, notification credentials or non-production database. No forms submitted. |
| D4 consented privacy-safe analytics | **Blocked** | No analytics/consent owner approval; no instrumentation added. |
| D acceptance | **Fail** | Four-pillar copy/path work is partial; E2E and screenshots are unverified. |
| E1 production crawl and deployment identity | **Blocked** | Live host responses and deployed SHA/build ID unavailable. |
| E2 factual structured data | **Blocked** | Owner-approved corporate identity/evidence absent; schema additions were not made. |
| E3 WCAG 2.2 AA browser/manual review | **Blocked** | No browser/axe/manual assistive technology review performed. |
| E4 lab and field Core Web Vitals | **Blocked** | No lab capture or CrUX/field data; do not infer scores. |
| E5 production headers/CSP/auth review | **Blocked** | No production response headers or staging security assessment. |
| E production crawl, structured data, accessibility, CWV, headers | **Blocked** | Production SHA/headers and browser/a11y/performance evidence unavailable. Do not infer production status from local source. |
| E acceptance | **Fail** | Production, accessibility, structured data, security and performance evidence remains unavailable. |
| Production release decision | **NO-GO** | CI, lint, clean Node 22 tests/build, staging DB behavior, owner/legal approvals, browser/a11y and deployed evidence remain open. |
