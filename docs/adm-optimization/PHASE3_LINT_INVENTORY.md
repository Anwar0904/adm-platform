# Phase 3 full lint error inventory

Captured on 18 November 2026 at `fe47f3fe66acef64f48f40203f21ef936b5d3123` with Node `v26.13.0`, after removing isolated build/test output. Command: `npm run lint -- --format json`.

Result: exit 1; 537 files checked; 93 errors and 78 warnings.
No lint rules were disabled. Error entries list repository-relative path, rule, and count.

## Error counts by rule
- `react/no-unescaped-entities`: 38
- `@typescript-eslint/no-empty-object-type`: 26
- `@typescript-eslint/no-explicit-any`: 19
- `react-hooks/set-state-in-effect`: 10

## Errors by file and rule
- `src/app/(public)/services/[slug]/page.tsx`: @typescript-eslint/no-explicit-any (4)
- `src/components/admin/auth/admin-login-form.tsx`: react/no-unescaped-entities (1)
- `src/components/admin/layout/admin-shell.tsx`: react-hooks/set-state-in-effect (2)
- `src/components/admin/portfolio-management.tsx`: @typescript-eslint/no-explicit-any (6); react-hooks/set-state-in-effect (2)
- `src/components/admin/roles/roles-page.tsx`: react-hooks/set-state-in-effect (1)
- `src/components/admin/services/services-management.tsx`: react-hooks/set-state-in-effect (1)
- `src/components/admin/settings/settings-page.tsx`: @typescript-eslint/no-explicit-any (1)
- `src/components/admin/tags/tags-management.tsx`: react-hooks/set-state-in-effect (1)
- `src/components/admin/users/users-page.tsx`: @typescript-eslint/no-explicit-any (3); react-hooks/set-state-in-effect (1)
- `src/components/blog-detail/share-section.tsx`: react-hooks/set-state-in-effect (1)
- `src/components/categories/categories-management.tsx`: react-hooks/set-state-in-effect (1)
- `src/components/consultation/consultation-final-cta-section.tsx`: react/no-unescaped-entities (2)
- `src/components/contact/contact-faq-section.tsx`: react/no-unescaped-entities (1)
- `src/components/contact/ContactFinalCTASection.tsx`: react/no-unescaped-entities (2)
- `src/components/contact/contact-form-section.tsx`: react/no-unescaped-entities (1)
- `src/components/contact/ContactHeroSection.tsx`: react/no-unescaped-entities (2)
- `src/components/contact/contactMethods.tsx`: react/no-unescaped-entities (1)
- `src/components/contact/OfficeLocationSection.tsx`: react/no-unescaped-entities (2)
- `src/components/faqs/faq-cta.tsx`: react/no-unescaped-entities (3)
- `src/components/industries/DeliveryProcess.tsx`: react/no-unescaped-entities (4)
- `src/components/industries/IndustryCaseStudies.tsx`: react/no-unescaped-entities (1)
- `src/components/industries/IndustryCTA.tsx`: react/no-unescaped-entities (2)
- `src/components/portfolio/hero.tsx`: react/no-unescaped-entities (1)
- `src/components/portfolio/PortfolioFinalCTA.tsx`: react/no-unescaped-entities (1)
- `src/components/portfolio/PortfolioTestimonials.tsx`: react/no-unescaped-entities (2)
- `src/components/service-detail/Hero.tsx`: @typescript-eslint/no-explicit-any (2)
- `src/components/service-detail/ServiceFAQs.tsx`: react/no-unescaped-entities (1)
- `src/components/service-detail/ServiceProcess.tsx`: react/no-unescaped-entities (1)
- `src/components/services/services-cta-section.tsx`: react/no-unescaped-entities (2)
- `src/components/team/JoinTeamSection.tsx`: react/no-unescaped-entities (4)
- `src/components/team/TeamCultureSection.tsx`: react/no-unescaped-entities (2)
- `src/components/testimonials/testimonials-grid.tsx`: react/no-unescaped-entities (2)
- `src/models/user.model.ts`: @typescript-eslint/no-explicit-any (1)
- `src/repositories/base.repository.ts`: @typescript-eslint/no-explicit-any (1)
- `src/repositories/blog.repository.ts`: @typescript-eslint/no-explicit-any (1)
- `src/services/portfolio.service.ts`: @typescript-eslint/no-empty-object-type (1)
- `src/types/application.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/blog.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/category.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/industry.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/lead.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/page.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/portfolio.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/service.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/session.types.ts`: @typescript-eslint/no-empty-object-type (1)
- `src/types/settings.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/tag.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/team-member.types.ts`: @typescript-eslint/no-empty-object-type (2)
- `src/types/testimonial.types.ts`: @typescript-eslint/no-empty-object-type (2)

## Warning counts by rule
- `import/no-anonymous-default-export`: 29
- `@typescript-eslint/no-unused-vars`: 24
- `@next/next/no-img-element`: 24
- `react-hooks/incompatible-library`: 1
