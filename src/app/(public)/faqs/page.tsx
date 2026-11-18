import FAQAccordion from "@/components/faqs/faq-accordion";
import FAQCategories from "@/components/faqs/faq-categories";
import FAQCTA from "@/components/faqs/faq-cta";
import FAQHero from "@/components/faqs/faq-hero";

export const metadata: Metadata = {
    title: "Frequently Asked Questions | Arazi Digital Media",
    description:
        "Find answers to common questions about working with Arazi Digital Media across technology, marketing, AI and data.",
    alternates: { canonical: `${SITE_URL}/faqs` },
    openGraph: {
        type: "website",
        title: "Frequently Asked Questions | Arazi Digital Media",
        description:
            "Answers to common questions about ADM's capabilities and ways of working.",
        url: `${SITE_URL}/faqs`,
    },
};


export default function FAQsPage() {
    return (
        <>
            <FAQHero />
            <FAQCategories />
            <FAQAccordion />
            <FAQCTA />
        </>
    );
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
