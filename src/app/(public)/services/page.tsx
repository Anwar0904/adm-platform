
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import FAQPreviewSection from "@/components/services/faq-preview-section";
import ServicesHeroSection from "@/components/services/hero-section";
import ProcessSection from "@/components/services/process-section";
import ServicesCTASection from "@/components/services/services-cta-section";
import ServicesGridSection from "@/components/services/services-grid-section";
import TechnologiesSection from "@/components/services/technologies-section";
import WhyADMSection from "@/components/services/why-adm-section";

export const metadata: Metadata = {
  title: { absolute: "Technology, Marketing, AI & Data Capabilities | ADM" },
  description:
    "Explore Arazi Digital Media's Technology, Marketing, AI and Data capabilities, including software development, SEO, paid media, AI automation and business analytics.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "Technology, Marketing, AI & Data Capabilities | ADM",
    description:
      "Connected digital services across technology, marketing, artificial intelligence and data from Arazi Digital Media.",
    url: `${SITE_URL}/services`,
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <ServicesHeroSection />
      <ServicesGridSection />
      <WhyADMSection />
      <ProcessSection />
      <TechnologiesSection />
      <FAQPreviewSection />
      <ServicesCTASection />
    </main>
  );
}
