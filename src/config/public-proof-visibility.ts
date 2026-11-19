/**
 * Public proof stays hidden unless the corresponding evidence and permissions
 * have been reviewed. Flip a section only with its completed trust-register row.
 */
export const publicProofVisibility = {
  homepageClientLogos: false,
  homepageMetrics: false,
  homepagePortfolioProof: false,
  homepageTestimonials: false,
  portfolioEvidence: false,
  testimonialEvidence: false,
} as const;
