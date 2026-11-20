# Phase 6 trust and approval matrix

Evidence references below are source references, not proof that business claims are false. Public claims require owner evidence and permission before being restored.

| Claim/content | Source or public route | Phase 6 visibility | Evidence required | Approval owner |
|---|---|---|---|---|
| Portfolio client/product/case-study examples | Portfolio CMS; `/portfolio`; public portfolio APIs | Default-deny per record. Only `published` plus complete `publicProof` is returned. | Classification, source URL or internal reference, customer permission/consent where relevant, permitted exact fields/media, expiry | Company owner + content approver |
| Client names, logos, imagery, outcomes | Portfolio CMS and dormant legacy portfolio components | Not returned unless exact element is allowed; client name is currently not serialized. Legacy proof components are no longer mounted on `/portfolio`. | Ownership and written permission, claim source and review date | Company owner + client/content owner |
| ADM products, concepts, prototypes | Portfolio proof classification | Not automatically treated as ADM assets; only classified and individually approved entries can appear. | Ownership, current status, screenshot/demo permission, limitations, permitted fields | Product owner + company owner |
| Homepage metrics, logos, testimonials | `publicProofVisibility` and legacy components | Existing proof controls remain off. | Metric definition/source/date; logo and portrait/quote permissions | Company owner + evidence owner |
| Contact identity (email, phone, address, social profiles) | `src/config/company-contact.ts`; `/contact`; footer | Footer already omits empty identity values. Contact methods/map blocks are not mounted; form remains available. | Exact verified business inbox, number, address, map pin, and current response channel | Company owner |
| Response-time/free-service guarantees | Contact/consultation components | Removed from rendered contact/consultation flows. | Operational SLA and whether consultation is free, with terms and owner approval | Company operations owner |
| Global client coverage/office claims | Contact and FAQ source | Rendered copy changed to neutral working-arrangement language; office location block is not mounted. | Actual service/geographic footprint and permitted wording | Company owner/legal |
| Industry counts/case studies | `/industries` static hero/showcase components | Unverified case-study and count sections no longer mounted. Capability and industry descriptions remain. | Source data, timeframe, client approval, proof for each stated count | Company owner + content owner |
| About page media | `CompanyVideo`, `company-content.ts` | Third-party sample video removed; a neutral branded decorative visual is shown. | Owned ADM footage and releases if video is restored | Company owner + media owner |
| Legal identity, privacy/cookie/terms contact path | `/privacy-policy`, `/terms`, `/cookies` | Exact `hello@adm.com` placeholder replaced by contact-form instructions; legal entity/jurisdiction/date remain owner review items. | Legal entity, jurisdiction, effective dates, data handling/retention and working privacy contact | Company owner + legal/privacy reviewer |
| GlobalSMMPortal association | No ADM attribution added | Treated as separate unless approved attribution is supplied. | Explicit company ownership and public attribution approval | Company owner |

No secrets, private evidence identifiers, customer data, or production CMS content were copied into this register. Evidence reference IDs in the CMS are non-secret audit references only and are never exposed publicly.
