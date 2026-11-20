# Phase 6 portfolio root cause and CMS contract

## Root cause

`src/config/public-proof-visibility.ts` disabled the whole portfolio experience. The gated route then rendered only a heading, a review notice, and a Services link. Old UI components retained static projects, outcomes, portraits, client names, and controls unrelated to live CMS data. Separately, the public CMS service treated `status: published` as sufficient public permission, while admin GET routes did not enforce `portfolio.read`. The admin form sent title-case statuses although the CMS enum uses lowercase values.

## Publication contract

Public visibility requires **both** `status: "published"`, `isDeleted: false`, and `publicProof` with all of:

- `approvalStatus: "approved"`, a valid `approvedAt`, `approvedByRole`, and non-empty `referenceId`;
- `classification` in `client-project`, `adm-product`, `anonymized-engagement`, or `concept-prototype`;
- an explicit `permittedElements` list containing at least `title` and `shortDescription`;
- a non-expired `consentExpiresAt`, if supplied.

The allow-list can separately authorize category, neutral visual, technologies, industries, ADM capability facets, client name, and project URL. Client name is selected only inside the server query and emitted only when explicitly permitted. Rich content, notes, evidence references, author information, and internal CMS fields are never returned in public portfolio responses. Project URLs must parse as HTTP(S).

Four public facets are Technology, Marketing, AI, and Data. Each must be individually listed in approved `publicProof.capabilities` and permitted via `capabilities`; no facet is inferred from unrelated CMS fields. Filter controls operate on returned approved records.

## Compatibility and approval operations

This is an additive, optional Mongoose field. No production database was accessed and no migration or backfill was run. Missing `publicProof` data is excluded, so existing published records are **not grandfathered**. The schema defaults new records to pending and an empty element allow-list. Old clients continue to create/edit projects with existing fields; generic create/update service mapping does not accept `publicProof`, preventing a normal editor from self-approving through the existing form.

`clientName` remains required for compatibility with existing CMS records. For a concept or ADM product, the field must contain an owner-confirmed accurate identity and stays private unless specifically approved; no blank or invented client is inserted. If owner-approved clientless entries become a real workflow, a future reversible migration can make the field optional at the model/validator/UI layer without rewriting existing records, then roll back by checking for null/blank records before restoring `required`. That migration is not needed for this zero-seed release and is not included.

The owner-controlled `PATCH /api/portfolio/[id]/approval` endpoint requires the new `portfolio.approve` permission, available through the existing role-permission editor but granted to no existing non-super-admin role by this code change. It only approves already-published, non-deleted records; it validates classification, reference, minimum public fields, and optional capabilities/expiry, and supports revocation with role/date audit metadata. It does not expose approval references in public DTOs. A company owner/content approver must establish evidence, consent, classification, allowed elements, expiry, approver role, and a non-secret reference before records can be approved. Current expected public portfolio record count is unknown and no content was seeded.

## Detail and fallback choice

Cards show the approved title, factual short description, approved type label, optional approved client name, and optional safe visual/outbound URL. Approved category, industry, and technology details are expandable. There are no internal detail links, so no `/portfolio/[slug]` page or sitemap URLs were added. The public slug API returns 404 for missing/unapproved records. With zero approved records, the index provides the four capability pathways, process, and consultation CTA. A CMS read outage retains this process content and reports portfolio availability without showing cached proof.
