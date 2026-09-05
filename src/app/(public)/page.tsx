import CallToActionSection from "@/components/home/CallToActionSection";
import { Hero } from "@/components/home/hero";
import LatestBlogsSection from "@/components/home/LatestBlogsSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import ProcessSection from "@/components/home/ProcessSection";
import ServicesSection from "@/components/home/services";
import TechnologyStackSection from "@/components/home/TechnologyStackSection";


export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <TechnologyStackSection />
      <ProcessSection />
      <PortfolioSection />
      <LatestBlogsSection />
      <CallToActionSection />
    </>
  );
}