import ConsultationFaqSection from "@/components/consultation/consultation-faq-section";
import ConsultationFinalCTASection from "@/components/consultation/consultation-final-cta-section";
import ConsultationProcessSection from "@/components/consultation/consultation-process-section";
import ConsultationRequestSection from "@/components/consultation/consultation-request-section";
import ConsultationHero from "@/components/consultation/ConsultationHero";

export const metadata: Metadata = {
    title: "Request a Consultation | Arazi Digital Media",
    description:
        "Share your goals with Arazi Digital Media and request a conversation about technology, marketing, AI or data.",
    alternates: { canonical: `${SITE_URL}/consultation` },
    openGraph: {
        type: "website",
        title: "Request a Consultation | Arazi Digital Media",
        description:
            "Request a conversation with Arazi Digital Media about your project or business challenge.",
        url: `${SITE_URL}/consultation`,
    },
};

export default function ConsultationPage() {
    return (
        <>
            <ConsultationHero />
            <ConsultationRequestSection />
            <ConsultationProcessSection />
            <ConsultationFaqSection />
            <ConsultationFinalCTASection />
        </>
    )
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
