# Phase 5 public trust decisions

This register records source presentation controls, not a claim that the underlying claims are false. No customer evidence, permissions, or owner approvals were supplied in this task. Evidence owner/reviewer: **company owner, pending**. No private identifiers are recorded.

| Claim group | Source / public location | Current presentation | Evidence / owner decision |
|---|---|---|---|
| `98% Organization Satisfaction` | `src/components/home/hero/Hero.tsx`, `/` | Removed and replaced by non-quantified Data Insights content. | No approved source located; owner approval pending before any metric restoration. |
| Client logos / trusted-company proof | `TrustedCompanies` on `/` | Disabled by `publicProofVisibility.homepageClientLogos` default false. | Permission and logo ownership unverified. |
| Aggregate statistics | `StatsSection` on `/` | Disabled by `homepageMetrics` default false. | Definitions, source, period, and evidence unverified. |
| Portfolio outcomes and count proof | `PortfolioSection` on `/`; `/portfolio` | Homepage section gated; portfolio route presents a neutral selected-work message while evidence gating is off. | Customer status, outcomes, and permission require item-level owner review. |
| Testimonials, portraits, ratings | `TestimonialsSection`, `/testimonials` | Homepage testimonials and testimonial route proof sections disabled by default; neutral review message shown. | Quote attribution, image permission, rating source, and approval pending. |
| Reach and global operating claims | Existing copy across public pages | No broad copy rewrite was authorized; aspirational copy remains subject to claim-by-claim review. | Operational footprint is unverified. Owner/legal review pending. |
| Leadership and team | Existing leadership/team pages | Not hidden by this change. | Identity, current role, and consent must be confirmed by the owner. |
| Products, services, delivery guarantees | Existing service/CMS copy | Not rewritten. | Product status and service commitments require review. |
| Contact details, legal entity, policy dates, jurisdiction, consent/retention | Contact and legal routes | Not changed. | Explicit owner/legal approval and real contact routing are blocked. No contact facts were guessed. |

The reversible switches are in `src/config/public-proof-visibility.ts`; all proof switches default to false. Re-enable a claim only after a dated trust-register row records exact wording/asset, source, public URL, evidence owner, permission, expiry, and reviewer decision. The switches affect presentation only; they do not edit CMS records.

## Rollback

Restore a gated section by changing its switch only after the required evidence and approval are recorded. Reverting the homepage/portfolio/testimonial files restores prior public rendering and should not be done without owner review because unverified proof would become visible again.
