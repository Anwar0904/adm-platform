import FeaturedSuccessStory from "@/components/testimonials/featured-success-story";
import TestimonialsCTA from "@/components/testimonials/testimonials-cta";
import TestimonialsGrid from "@/components/testimonials/testimonials-grid";
import TestimonialsHero from "@/components/testimonials/testimonials-hero";
import TrustSection from "@/components/testimonials/trust-section";
import Link from "next/link";
import { publicProofVisibility } from "@/config/public-proof-visibility";

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
        publicProofVisibility.testimonialEvidence ? (
            <>
                <TestimonialsHero />
                <FeaturedSuccessStory />
                <TestimonialsGrid />
                <TrustSection />
                <TestimonialsCTA />
            </>
        ) : (
            <section className="mx-auto max-w-5xl px-4 py-24 text-center text-white sm:px-6">
                <h1 className="text-4xl font-bold">Customer stories</h1>
                <p className="mx-auto mt-6 max-w-2xl text-slate-300">
                    Customer stories are being reviewed before publication. Learn about ADM&apos;s
                    Technology, Marketing, AI and Data capabilities.
                </p>
                <Link href="/services" className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                    Explore our capabilities
                </Link>
            </section>
        )
    );
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
