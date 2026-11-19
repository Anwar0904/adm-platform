import ClientSuccessMetrics from "@/components/portfolio/ClientSuccessMetrics";
import FeaturedProjectsGrid from "@/components/portfolio/featured-projects-grid";
import PortfolioHero from "@/components/portfolio/hero";
import IndustriesShowcase from "@/components/portfolio/IndustriesShowcase";
import PortfolioMasonry from "@/components/portfolio/portfolio-masonry";
import PortfolioFAQ from "@/components/portfolio/PortfolioFAQ";
import PortfolioFilter from "@/components/portfolio/PortfolioFilter";
import PortfolioFinalCTA from "@/components/portfolio/PortfolioFinalCTA";
import PortfolioTestimonials from "@/components/portfolio/PortfolioTestimonials";
import ProjectProcess from "@/components/portfolio/ProjectProcess";
import Link from "next/link";
import { publicProofVisibility } from "@/config/public-proof-visibility";

export const metadata: Metadata = {
    title: { absolute: "Selected Work | Arazi Digital Media" },
    description:
        "Explore work presented by Arazi Digital Media across digital products, technology, marketing, AI and data.",
    alternates: { canonical: `${SITE_URL}/portfolio` },
    openGraph: {
        type: "website",
        title: "Selected Work | Arazi Digital Media",
        description:
            "Explore work presented by Arazi Digital Media across its four capabilities.",
        url: `${SITE_URL}/portfolio`,
    },
};

export default function PortfolioPage() {
    return (
        publicProofVisibility.portfolioEvidence ? (
            <>
                <PortfolioHero />
                <PortfolioFilter />
                <PortfolioMasonry />
                <IndustriesShowcase />
                <ClientSuccessMetrics />
                <ProjectProcess />
                <PortfolioTestimonials />
                <PortfolioFAQ />
                <PortfolioFinalCTA />
            </>
        ) : (
            <section className="mx-auto max-w-5xl px-4 py-24 text-center text-white sm:px-6">
                <h1 className="text-4xl font-bold">Selected Work</h1>
                <p className="mx-auto mt-6 max-w-2xl text-slate-300">
                    Portfolio examples are being reviewed before publication. Explore ADM&apos;s
                    Technology, Marketing, AI and Data capabilities in the meantime.
                </p>
                <Link href="/services" className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                    Explore our capabilities
                </Link>
            </section>
        )
    )
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
