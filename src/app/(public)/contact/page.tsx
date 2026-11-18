import ContactFAQSection from "@/components/contact/contact-faq-section";
import ContactFormSection from "@/components/contact/contact-form-section";
import ContactFinalCTASection from "@/components/contact/ContactFinalCTASection";
import ContactHeroSection from "@/components/contact/ContactHeroSection";
import ContactMethodsSection from "@/components/contact/contactMethods";
import OfficeLocationSection from "@/components/contact/OfficeLocationSection";
import WhyChooseADMSection from "@/components/contact/WhyChooseADMSection";

export const metadata: Metadata = {
    title: "Contact Arazi Digital Media",
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
            <ContactMethodsSection />
            <ContactFormSection />
            <WhyChooseADMSection />
            <OfficeLocationSection />
            <ContactFinalCTASection />
            <ContactFAQSection />
        </>
    )
}
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
