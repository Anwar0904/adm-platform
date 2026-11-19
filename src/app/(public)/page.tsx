import type { Metadata } from "next";
import CallToActionSection from "@/components/home/CallToActionSection";
import FaqSection from "@/components/home/FaqSection";
import { Hero } from "@/components/home/hero";
import { publicProofVisibility } from "@/config/public-proof-visibility";
import LatestBlogsSection from "@/components/home/LatestBlogsSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import ProcessSection from "@/components/home/ProcessSection";
import ServicesSection from "@/components/home/services";
import StatsSection from "@/components/home/stats";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedCompanies from "@/components/home/trusted";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Arazi Digital Media | Technology, Marketing, AI & Data" },
  description:
    "Arazi Digital Media brings together technology, marketing, AI and data to help organizations build digital products, reach audiences and make better use of information.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "Arazi Digital Media | Technology, Marketing, AI & Data",
    description:
      "Building What's Next for the Digital Economy. Arazi Digital Media brings together Technology, Marketing, AI and Data.",
    url: `${SITE_URL}/`,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {publicProofVisibility.homepageClientLogos && <TrustedCompanies />}
      <ServicesSection />
      {publicProofVisibility.homepageMetrics && <StatsSection />}
      <ProcessSection />
      {publicProofVisibility.homepagePortfolioProof && <PortfolioSection />}
      {publicProofVisibility.homepageTestimonials && <TestimonialsSection />}
      <FaqSection />
      <LatestBlogsSection />
      <CallToActionSection />
    </>
  );
}
