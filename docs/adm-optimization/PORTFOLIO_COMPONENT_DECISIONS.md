# Portfolio component decisions

Audit performed against the current local worktree on 20 November 2026. The public route is wrapped by `src/app/(public)/layout.tsx`, which owns the shared navbar, `<main>`, and footer; the portfolio experience must not add another `<main>`. The route is dynamic and reads only through `publicContentService.getPortfolio`. `rg` was run across `src` for every component name below. The old portfolio components have no production imports. The homepage portfolio section is imported by the homepage but remains behind the `publicProofVisibility.homepagePortfolioProof` feature gate, which is false in the current configuration.

| component/path | referenced in production? | actual rendering/feature-gated? | useful design/interaction idea | factual/content/security problem | decision: elevate/merge/rewrite/retain/remove | references checked | regression risk |
|---|---|---|---|---|---|---|---|
| `src/components/portfolio/hero.tsx` | No | No | Split editorial hero, atmospheric light | Unsupported metrics, stock images/case framing | Rebuild visual language in `PortfolioHero`; remove dead source | Project-wide `rg`; portfolio route/layout | Low; no imports |
| `src/components/portfolio/portfolio-masonry.tsx` | No | No | Varied tile sizes and visual rhythm | Six hard-coded projects and photos; inert Load More | Reuse rhythm with approved records; remove dead source | Project-wide `rg` | Low; no imports |
| `src/components/portfolio/featured-projects-grid.tsx` | No | No | Feature-led bento composition | Hard-coded cases, unapproved claims, broken case-study URLs | Rebuild as approved-record showcase; remove dead source | Project-wide `rg`; no `/portfolio/[slug]` route found | Low; no imports |
| `src/components/portfolio/PortfolioFilter.tsx` | No | No | Faceted discovery controls | Independent controls do not filter a grid | Merge working conditional facets into `ApprovedWorkShowcase`; remove dead source | Project-wide `rg`; route draft | Low; no imports |
| `src/components/portfolio/IndustriesShowcase.tsx` | No | No | Industry context can make capabilities tangible | Unsupported per-industry project counts and authority | Replace with capability/problem stories; remove dead source and unsupported counts | Project-wide `rg`; industries route reviewed | Low; no imports |
| `src/components/portfolio/ClientSuccessMetrics.tsx` | No | No | Outcome-oriented visual hierarchy | Unsupported numbers, guarantees and achievement claims | Remove dead source; do not recreate unverified metrics | Project-wide `rg` | Low; no imports |
| `src/components/portfolio/ProjectProcess.tsx` | No | No | Timeline and progressive stages | Guarantees, fixed deliverables and outcome rhetoric | Rebuild as five-stage engagement approach; remove dead source | Project-wide `rg` | Low; no imports |
| `src/components/portfolio/PortfolioTestimonials.tsx` | No | No | Strong testimonial layout only | Named people, organizations, stock portraits, quotes, ratings and metrics lack evidence | Remove dead source; preserve testimonial CMS elsewhere | Project-wide `rg`; admin/testimonial routes not targeted | Low; no imports |
| `src/components/portfolio/PortfolioFAQ.tsx` | No | No | Native disclosure/accordion pattern | Fixed delivery timelines, broad claims, inert CTA | Rebuild as buyer FAQ; remove dead source | Project-wide `rg` | Low; no imports |
| `src/components/portfolio/PortfolioFinalCTA.tsx` | No | No | Strong closing composition | Unsupported metrics and promise language; overlapping CTA | Rebuild tailored close with consultation/contact links; remove dead source | Project-wide `rg` | Low; no imports |
| `src/components/portfolio/selected-work.tsx` | Yes, from portfolio page before refactor | Yes before refactor | Approved DTO boundary, filter helper, safe image rendering | Generic hierarchy, repeated equal cards, excess facets for sparse records | Replace with server-composed experience; remove old client monolith, keep approved DTO boundary and tested filter utility | Project-wide `rg`; route was its only importer | Medium; preserve approved fields and filter behavior |
| `src/components/home/PortfolioSection.tsx` | Yes, homepage import | Gate is currently false | Editorial teaser can direct visitors to portfolio | Hard-coded project names/images and unsupported work descriptions | Keep home section feature-gated; replace fabricated cases with evidence-free capability teaser | Project-wide `rg`; homepage route and gate checked | Medium; keep gate and destination route |
| `src/app/(public)/portfolio/page.tsx` | App Router route | Yes | Server-side retrieval, canonical metadata, outage distinction | Imports generic `SelectedWork`; no screenshot review currently available | Retain data access and metadata; compose new experience from server props | Route plus public layout and service import | Medium; dynamic DB read and outage state must remain distinct |
| `src/app/(public)/layout.tsx` | All public routes | Yes | Shared brand navigation/footer | Owns `<main>` wrapper | Retain unchanged; portfolio children use sections, no nested main | Direct inspection | High if modified; no change planned |
| `src/utils/portfolio-filters.ts` | Used by current portfolio component and tests | Yes when approved items exist | Search/facets over approved records | None observed; receives approved DTO only | Retain and reuse | Project-wide `rg`; tests exist | Medium; test execution constrained by local Node runtime |

## Removal manifest

Verified unreferenced source removed after project-wide `rg` checks:

- `src/components/portfolio/hero.tsx`
- `src/components/portfolio/PortfolioFilter.tsx`
- `src/components/portfolio/portfolio-masonry.tsx`
- `src/components/portfolio/featured-projects-grid.tsx`
- `src/components/portfolio/IndustriesShowcase.tsx`
- `src/components/portfolio/ClientSuccessMetrics.tsx`
- `src/components/portfolio/ProjectProcess.tsx`
- `src/components/portfolio/PortfolioTestimonials.tsx`
- `src/components/portfolio/PortfolioFAQ.tsx`
- `src/components/portfolio/PortfolioFinalCTA.tsx`
- `src/components/portfolio/selected-work.tsx` (the previous route-only monolith)

The homepage portfolio component was not unreferenced, so it was rewritten in place as an evidence-free capabilities teaser; its existing proof gate remains off. Admin/CMS components, testimonial management and portfolio APIs are retained.
