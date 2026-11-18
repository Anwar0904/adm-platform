# ADM route-level SEO audit

Local code audit only. No production host, HTTP status, redirect chain, Search Console or database content was available. “Implemented” below describes local route code, not verified production behavior.

| URL / route family | Template | Metadata / canonical | Structured data | Sitemap | Evidence / follow-up |
| --- | --- | --- | --- | --- | --- |
| `/` | Home | Unique title, description, canonical `/`, OG | None | Yes | Implemented locally; production status unverified. |
| `/about` | Company | Unique title/description/canonical | None | Yes | Direct “global company” descriptor removed from copy; review remaining reach claims. |
| `/about/leadership-governance` and 3 committee routes | Governance/CMS team | Route-specific title/description/canonical | None | Yes | Availability of approved active profiles depends on MongoDB. |
| `/about/sustainability` | Static | Unique title/description/canonical | None | Yes | Owner approval of published statements pending. |
| `/services` | Capability hub | Unique title/description/canonical | None | Yes | Four pillars are represented by local page sections/data. |
| `/services/{technology,marketing,ai,data}` | Pillar details | Generated title/description/canonical | None | Yes | Static pillar definitions in `pillar-services.ts`. |
| `/services/[slug]` | CMS service detail | Published record title/description/canonical | None | Published services only | Production records and HTTP status unverified. |
| `/portfolio` | Portfolio overview | Unique title/description/canonical | None | Yes | No local detail route. Public numeric claims need approval. |
| `/industries` | Industries overview | Unique title/description/canonical | None | Yes | No local detail route. Public counts/case studies need approval. |
| `/blogs` | Editorial listing | Unique title/description/canonical | None | Yes | Current CMS listing record count unverified. |
| `/blogs/[slug]` | Published article | Generated title/description/canonical; missing record noindex | Article schema absent | Published blogs only | Correct authors/date and verify publication state in CMS. |
| `/careers` | Open roles | Unique title/description/canonical | None | Yes | Only current public career entries are included. |
| `/careers/[slug]` | Career detail | Generated title/description/canonical | JobPosting | Public entries only | Application route explicitly directs visitors to contact. |
| `/contact` | Contact/funnel | Unique title/description/canonical | None | Yes | Contact form endpoint validates server-side; live delivery unverified. |
| `/consultation` | Consultation funnel | Unique title/description/canonical | None | Yes | Separate funnel retained; live delivery unverified. |
| `/faqs`, `/testimonials` | Static/CMS mix | Unique title/description/canonical | None | Yes | FAQ/testimonial content accuracy/approval pending. |
| `/privacy-policy`, `/terms`, `/cookies` | Legal pages | Existing titles/descriptions plus explicit canonical | None | Yes | Legal text and contact address require owner/legal sign-off. |
| `/team` | Missing public template | N/A | N/A | Excluded | Footer link now points to implemented governance page. |
| `/portfolio/[slug]`, `/industries/[slug]` | Missing public templates | N/A | N/A | Excluded | Do not create URLs until templates and content are approved. |
| `/admin/*`, `/api/*` | Private/admin/API | Admin layout explicitly `noindex`; robots disallow where configured; auth enforced separately | N/A | No | Robots directives are not access controls; verify deployment protections. |

## Indexing and linking notes

- Sitemap static URLs mirror page files. Static routes have no `lastModified`; CMS entries use a parseable `updatedAt` only. Published blogs and services are included; portfolio and industry CMS records are not because their detail routes do not exist.
- `robots.ts` disallows admin/API and query URLs. Verify deployed robots output and ensure private data remains protected by auth, not robots alone.
- Search production for redirect chains, trailing slash and www normalization only after access to the production host. Keep established paths and `/consultation` intact until data justifies a change.
- Crawl internal links after deployment. The local audit identified and corrected a footer `/team` link; CMS-generated service links require the live dataset to validate.
- Verify image alternatives and one-H1/heading order per responsive template with browser/accessibility review; this source-only pass did not claim a complete visual audit.

## Search Console and analytics owner checklist

1. Verify the canonical production hostname and redirects, then set `NEXT_PUBLIC_SITE_URL` to that origin.
2. Submit `/sitemap.xml` in Search Console and inspect representative home, service, article, portfolio, contact and career URLs.
3. Review indexed/canonical selections, query-to-page mapping, duplicate titles and excluded URLs. Treat keyword targets as hypotheses until supported by Search Console/SERP evidence.
4. Confirm Vercel Analytics and any consent requirements with the privacy owner. Do not send contact details or message text as event properties.
