# Phase 6 security API audit

## Portfolio endpoint matrix

| Endpoint | Method | Access | Data/publication rule | Cache/error behavior |
|---|---|---|---|---|
| `/api/portfolio` | GET | `portfolio.read`; super-admin bypass remains in shared auth | Admin list may include draft records only after permission | private `no-store`; standard 401/403 response |
| `/api/portfolio/[id]` | GET | `portfolio.read` | Non-deleted record only | private `no-store`; 404 for absent ID; 401/403 before record lookup |
| `/api/portfolio/stats` | GET | `portfolio.read` | Admin-only counts | private `no-store`; standard 401/403 response |
| `/api/portfolio` | POST | Existing `portfolio.create` | Existing workflow preserved | Existing write response retained |
| `/api/portfolio/[id]` | PATCH | Existing `portfolio.update` | Existing workflow retained; does not accept proof approval metadata | Existing write response retained |
| `/api/portfolio/[id]` | DELETE | Existing `portfolio.delete` | Soft delete | Existing write response retained |
| `/api/portfolio/[id]/approval` | PATCH | New `portfolio.approve`; not auto-assigned to existing non-super-admin roles | Approve/revoke published, non-deleted records with required traceability and public-field allow-list | private `no-store`; strict schema; 404 when record is not publishable |
| `/api/public/portfolio` | GET | Public | Published, non-deleted, fully approved, non-expired record; selected DTO only | `no-store`; validation 400; DB/service outage 503 |
| `/api/public/portfolio/[slug]` | GET | Public | Same gate; unapproved/missing slug is 404 | `no-store`; validation 400; DB/service outage 503 |

The protected reads share `withPortfolioReadAuthorization`; its tests cover anonymous, insufficient permission, and authorized calls, including permission name, response status, and cache headers. Existing editor/update/delete permission distinctions are preserved. Auth runs before list/ID service reads, preventing data-dependent status or error differences for unauthorized callers.

The public serializer uses explicit field selection and only emits fields with individual approval. Public search intentionally does not query the full text index, because that index includes private client names and rich content and could otherwise create a match/no-match side channel. Pagination is capped at 50 records per request, sorting has a stable `_id` tie-breaker, and no project content is rendered as rich HTML.

## Adjacent endpoint review

Existing admin content APIs generally call the shared permission middleware; the three identified portfolio GETs were the concrete missing checks fixed here. Public blogs/services/industries/team/testimonial endpoints remain separate public publication surfaces and were not reclassified by this portfolio change. This slice does not certify every non-portfolio endpoint against IDOR or personal-data leakage; broader endpoint-by-endpoint testing remains a release gate.

## Test evidence

Added tests cover the portfolio read policy wrapper and 401/403/authorized no-store behavior, approval and expiry default-deny rules, HTTP(S)-only outbound URLs, media host normalization, public 404/503 response shapes, canonical portfolio status labels, approval schema validation, and intersecting portfolio filters. Full test execution is currently blocked by Node 26.13.0: `tsx` fails in every test worker during startup at `os.userInfo()` with `uv_os_get_passwd returned ENOMEM`. Re-run with supported Node 22 before release. No production drafts or customer records were queried.
