# Phase 5 changed-file manifest

**Baseline:** `629f0421bfc3a2755aa1545c8d82c54a2b6ec6c1` on `main`. No new commit or branch. The accompanying `PHASE5_REVIEW.patch` is the owner-reviewable patch.

Apply from a clean checkout of that baseline with `git apply PHASE5_REVIEW.patch`. This command was verified against a clean archive of the baseline.

## Modified tracked files

- `.github/workflows/quality.yml`
- `src/app/(public)/page.tsx`
- `src/app/(public)/portfolio/page.tsx`
- `src/app/(public)/services/[slug]/page.tsx`
- `src/app/(public)/testimonials/page.tsx`
- `src/app/cms-sitemap.xml/route.ts`
- `src/components/admin/auth/admin-login-form.tsx`
- `src/components/admin/layout/admin-shell.tsx`
- `src/components/admin/portfolio-management.tsx`
- `src/components/admin/roles/roles-page.tsx`
- `src/components/admin/services/services-management.tsx`
- `src/components/admin/settings/settings-page.tsx`
- `src/components/admin/tags/tags-management.tsx`
- `src/components/admin/users/users-page.tsx`
- `src/components/blog-detail/share-section.tsx`
- `src/components/categories/categories-management.tsx`
- `src/components/consultation/consultation-final-cta-section.tsx`
- `src/components/contact/ContactFinalCTASection.tsx`
- `src/components/contact/ContactHeroSection.tsx`
- `src/components/contact/OfficeLocationSection.tsx`
- `src/components/contact/contact-faq-section.tsx`
- `src/components/contact/contact-form-section.tsx`
- `src/components/contact/contactMethods.tsx`
- `src/components/faqs/faq-cta.tsx`
- `src/components/home/hero/Hero.tsx`
- `src/components/industries/DeliveryProcess.tsx`
- `src/components/industries/IndustryCTA.tsx`
- `src/components/industries/IndustryCaseStudies.tsx`
- `src/components/portfolio/PortfolioFinalCTA.tsx`
- `src/components/portfolio/PortfolioTestimonials.tsx`
- `src/components/portfolio/hero.tsx`
- `src/components/service-detail/Hero.tsx`
- `src/components/service-detail/ServiceFAQs.tsx`
- `src/components/service-detail/ServiceProcess.tsx`
- `src/components/services/services-cta-section.tsx`
- `src/components/team/JoinTeamSection.tsx`
- `src/components/team/TeamCultureSection.tsx`
- `src/components/testimonials/testimonials-grid.tsx`
- `src/database/seed.ts`
- `src/lib/seo/sitemap-content.ts`
- `src/lib/seo/sitemap.test.ts`
- `src/models/user.model.ts`
- `src/repositories/base.repository.ts`
- `src/repositories/blog.repository.ts`
- `src/repositories/career.repository.ts`
- `src/services/career.service.ts`
- `src/services/portfolio.service.ts`
- `src/types/application.types.ts`
- `src/types/blog.types.ts`
- `src/types/category.types.ts`
- `src/types/industry.types.ts`
- `src/types/lead.types.ts`
- `src/types/page.types.ts`
- `src/types/portfolio.types.ts`
- `src/types/service.types.ts`
- `src/types/session.types.ts`
- `src/types/settings.types.ts`
- `src/types/tag.types.ts`
- `src/types/team-member.types.ts`
- `src/types/testimonial.types.ts`

## Added files

- `PHASE5_CHANGED_FILES.md` (this manifest)
- `PHASE5_REVIEW.patch` (review patch; generated from this manifest and the source diff)
- `docs/adm-optimization/PHASE5_BASELINE.md`
- `docs/adm-optimization/PHASE5_CI_FIXES.md`
- `docs/adm-optimization/PHASE5_RELEASE_GATES.md`
- `docs/adm-optimization/PHASE5_SECURITY_AND_DATA_SAFETY.md`
- `docs/adm-optimization/PHASE5_STAGING_AND_SEO.md`
- `docs/adm-optimization/PHASE5_TRUST_DECISIONS.md`
- `scripts/verify-static-seo.py`
- `src/config/public-proof-visibility.test.ts`
- `src/config/public-proof-visibility.ts`
- `src/database/seed.test.ts`
- `src/lib/seo/sitemap-pagination.ts`

## Review notes

- `package.json` and `package-lock.json` are unchanged: Mongoose remediation is blocked on registry access and clean Node 22 validation.
- No database, forms, migrations, seed execution, external communication, or deployment was performed.
- Revert the trust presentation files and visibility config together to roll back visibility controls; retain the seed hard stop.
- For remaining risk and detailed rollback boundaries, see `docs/adm-optimization/PHASE5_RELEASE_GATES.md`.
