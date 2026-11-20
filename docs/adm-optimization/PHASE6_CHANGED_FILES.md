# Phase 6 changed-file manifest

Implementation edits are in the current worktree on `main`; no files were staged, committed, pushed, or deployed. Starting HEAD remains `8f1c2deedb4dbbaecbef0b9922b8e6e0b5776a39`.

## Phase 6 implementation

- `src/app/(public)/contact/page.tsx`
- `src/app/(public)/cookies/page.tsx`
- `src/app/(public)/industries/page.tsx`
- `src/app/(public)/portfolio/page.tsx`
- `src/app/(public)/privacy-policy/page.tsx`
- `src/app/(public)/terms/page.tsx`
- `src/app/api/portfolio/[id]/approval/route.ts`
- `src/app/api/portfolio/[id]/route.ts`
- `src/app/api/portfolio/route.ts`
- `src/app/api/portfolio/stats/route.ts`
- `src/app/api/public/portfolio/[slug]/route.ts`
- `src/app/api/public/portfolio/route.ts`
- `src/components/about/CompanyVideo.tsx`
- `src/components/admin/portfolio-management.tsx`
- `src/components/admin/roles/roles-page.tsx`
- `src/components/consultation/ConsultationHero.tsx`
- `src/components/consultation/consultation-final-cta-section.tsx`
- `src/components/consultation/consultation-request-section.tsx`
- `src/components/contact/ContactFinalCTASection.tsx`
- `src/components/contact/ContactHeroSection.tsx`
- `src/components/contact/WhyChooseADMSection.tsx`
- `src/components/contact/contact-faq-section.tsx`
- `src/components/contact/contact-form-section.tsx`
- `src/components/home/CallToActionSection.tsx`
- `src/components/industries/IndustriesGrid.tsx`
- `src/components/industries/IndustriesHero.tsx`
- `src/components/industries/IndustryCTA.tsx`
- `src/constants/permissions.ts`
- `src/models/portfolio.model.ts`
- `src/services/portfolio.service.ts`
- `src/services/public-content.service.ts`
- `src/types/portfolio.types.ts`
- `src/components/portfolio/selected-work.tsx`
- `src/lib/api/portfolio-public-response.ts`
- `src/lib/api/portfolio-read-handler.ts`
- `src/lib/api/private-response.ts`
- `src/utils/portfolio-admin-status.ts`
- `src/utils/portfolio-filters.ts`
- `src/utils/portfolio-public-proof.ts`
- `src/validators/portfolio-approval.validator.ts`
- `src/lib/api/portfolio-public-response.test.ts`
- `src/lib/api/portfolio-read-handler.test.ts`
- `src/utils/portfolio-admin-status.test.ts`
- `src/utils/portfolio-filters.test.ts`
- `src/utils/portfolio-public-proof.test.ts`
- `src/validators/portfolio-approval.validator.test.ts`
- `docs/adm-optimization/PHASE6_BASELINE_AND_LIVE_PARITY.md`
- `docs/adm-optimization/PHASE6_CHANGED_FILES.md`
- `docs/adm-optimization/PHASE6_IMPLEMENTATION.md`
- `docs/adm-optimization/PHASE6_PORTFOLIO_ROOT_CAUSE_AND_CMS_CONTRACT.md`
- `docs/adm-optimization/PHASE6_RELEASE_GATES.md`
- `docs/adm-optimization/PHASE6_SECURITY_API_AUDIT.md`
- `docs/adm-optimization/PHASE6_SEO_UX_ACCESSIBILITY.md`
- `docs/adm-optimization/PHASE6_TRUST_APPROVAL_MATRIX.md`

## Concurrent worktree change

`src/components/layout/navbar/Navbar.tsx` also appears modified in the current worktree, changing the unscrolled mobile height from `h-16` to `h-18`. It was not part of the Phase 6 edits in this implementation session; it is preserved as a concurrent worktree change and is excluded from the Phase 6 implementation above.
