import type { Metadata } from "next";
import CallToActionSection from "@/components/home/CallToActionSection";
import FaqSection from "@/components/home/FaqSection";
import { Hero } from "@/components/home/hero";
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
    "Arazi Digital Media is a global technology, marketing, AI and data company helping organizations create demand, build digital products, understand performance and scale with confidence.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "Arazi Digital Media | Technology, Marketing, AI & Data",
    description:
      "Building what's next for the digital economy through connected technology, marketing, AI and data capabilities.",
    url: `${SITE_URL}/`,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedCompanies />
      <ServicesSection />
      <StatsSection />
      <ProcessSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FaqSection />
      <LatestBlogsSection />
      <CallToActionSection />
    </>
  );
}
