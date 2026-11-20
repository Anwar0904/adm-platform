# Portfolio trust and API contract

## Public rendering boundary

`src/app/(public)/portfolio/page.tsx` remains a dynamic server page and fetches through `publicContentService.getPortfolio({ page: 1, limit: 50 })`. Only that service's approved public projections are passed to the experience. The client components receive the small public display shape (`PublicPortfolioProject`); they do not receive the raw CMS document, approval metadata, private notes, or pending/draft records. If DB retrieval throws, the server renders an explicit temporary-unavailability message within evergreen capability content. An empty result is treated as an empty approved-public list, not as an outage.

The management read routes (`GET /api/portfolio`, `/api/portfolio/[id]`, `/api/portfolio/stats`) use the portfolio read-permission guard and no-store response handling. The public portfolio API and slug endpoint share the approved-public service contract and do not expose draft, deleted, unapproved, expired, or unapproved fields/media. The separate approval endpoint requires `portfolio.approve`; publish status alone does not grant proof approval. Existing safe URL/media validation and 404 versus temporary database failure behavior remain in place.

## Evidence rules

Public project records require explicit owner approval, documented permission reference, approval date, and current/non-expired approval. Classification must be one of client project, ADM-owned product, authorized anonymized engagement, or concept/prototype. Content is released only when the applicable field is approved. Client identity, outcomes, quotes, ratings, logos, technologies, screenshots and external links each require their own valid permission/evidence context. Revocation/expiry removes the item from public results. Concept work must remain clearly distinguished from delivered work.

This page change adds no project records, approvals, claims or schema migration. Missing approved records render capability content only. The illustrative maps and editorial problem statements are explicitly not project evidence.

## Verification references

The prior local Phase 6 security review and regression tests are documented in `PHASE6_SECURITY_API_AUDIT.md`, `PHASE6_TRUST_APPROVAL_MATRIX.md`, and `PHASE6_PORTFOLIO_ROOT_CAUSE_AND_CMS_CONTRACT.md`. Those controls are preserved by this UI refactor. Do not seed or write production data as part of validation.
