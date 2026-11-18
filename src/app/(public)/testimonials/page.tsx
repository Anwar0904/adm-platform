import FeaturedSuccessStory from "@/components/testimonials/featured-success-story";
import TestimonialsCTA from "@/components/testimonials/testimonials-cta";
import TestimonialsGrid from "@/components/testimonials/testimonials-grid";
import TestimonialsHero from "@/components/testimonials/testimonials-hero";
import TrustSection from "@/components/testimonials/trust-section";

export const metadata: Metadata = {
    title: { absolute: "Testimonials | Arazi Digital Media" },
    description:
        "Read testimonials and perspectives published by Arazi Digital Media about client experiences and project work.",
    alternates: { canonical: `${SITE_URL}/testimonials` },
    openGraph: {
        type: "website",
        title: "Testimonials | Arazi Digital Media",
        description:
            "Testimonials and perspectives published by Arazi Digital Media.",
        url: `${SITE_URL}/testimonials`,
    },
};


export default function TestimonialsPage() {
    return (
        <>
            <TestimonialsHero />
            <FeaturedSuccessStory />
            <TestimonialsGrid />
            <TrustSection />
            <TestimonialsCTA />
        </>
    );
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
