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

export const metadata: Metadata = {
    title: "Selected Work | Arazi Digital Media",
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
    )
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
