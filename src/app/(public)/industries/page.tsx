import DeliveryProcess from "@/components/industries/DeliveryProcess";
import IndustriesGrid from "@/components/industries/IndustriesGrid";
import IndustriesHero from "@/components/industries/IndustriesHero";
import IndustryCaseStudies from "@/components/industries/IndustryCaseStudies";
import IndustryCTA from "@/components/industries/IndustryCTA";
import IndustryFaq from "@/components/industries/IndustryFaq";
import TechnologyExpertise from "@/components/industries/TechnologyExpertise";
import IndustriesShowcase from "@/components/portfolio/IndustriesShowcase";

export const metadata: Metadata = {
    title: { absolute: "Industries | Arazi Digital Media" },
    description:
        "Explore industry perspectives and digital solutions presented by Arazi Digital Media across technology, marketing, AI and data.",
    alternates: { canonical: `${SITE_URL}/industries` },
    openGraph: {
        type: "website",
        title: "Industries | Arazi Digital Media",
        description:
            "Explore the industries and business contexts addressed across ADM's capabilities.",
        url: `${SITE_URL}/industries`,
    },
};

export default function IndustriesPage() {
    return (
        <>
            <IndustriesHero />
            <IndustriesGrid />
            <IndustriesShowcase />
            <IndustryCaseStudies />
            <TechnologyExpertise />
            <DeliveryProcess />
            <IndustryFaq />
            <IndustryCTA />
        </>
    )
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
