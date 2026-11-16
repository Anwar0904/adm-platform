export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arazidigitalmedia.com";
export const CAREERS_CANONICAL_URL = "https://www.arazidigitalmedia.com/careers";

export const publicRoutes = {
    home: "/",
    services: "/services",
    portfolio: "/portfolio",
    industries: "/industries",
    blogs: "/blogs",
    careers: "/careers",
    contact: "/contact",
    consultation: "/consultation",
    team: "/team",
    testimonials: "/testimonials",
    faqs: "/faqs",
    privacyPolicy: "/privacy-policy",
    terms: "/terms",
    cookies: "/cookies",
} as const;
