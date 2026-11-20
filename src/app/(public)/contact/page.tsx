import ContactFAQSection from "@/components/contact/contact-faq-section";
import ContactFormSection from "@/components/contact/contact-form-section";
import ContactFinalCTASection from "@/components/contact/ContactFinalCTASection";
import ContactHeroSection from "@/components/contact/ContactHeroSection";
import WhyChooseADMSection from "@/components/contact/WhyChooseADMSection";

export const metadata: Metadata = {
    title: { absolute: "Contact Arazi Digital Media" },
    description:
        "Contact Arazi Digital Media to discuss a technology, marketing, AI or data challenge and explore a possible next step.",
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        type: "website",
        title: "Contact Arazi Digital Media",
        description:
            "Start a conversation with Arazi Digital Media about your digital goals.",
        url: `${SITE_URL}/contact`,
    },
};


export default function ContactPage() {
    return (
        <>
            <ContactHeroSection />
            <ContactFormSection />
            <WhyChooseADMSection />
            <ContactFinalCTASection />
            <ContactFAQSection />
        </>
    )
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
