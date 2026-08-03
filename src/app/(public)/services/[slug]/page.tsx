import Hero from "@/components/service-detail/Hero";
import { RelatedServices } from "@/components/service-detail/related-services";
import ServiceCaseStudies from "@/components/service-detail/ServiceCaseStudies";
import ServiceDetailProcess from "@/components/service-detail/ServiceDetailProcess";
import ServiceFAQs from "@/components/service-detail/ServiceFAQs";
import ServicePricing from "@/components/service-detail/ServicePricing";
import ServiceProcessSection from "@/components/service-detail/ServiceProcess";

export default function ServiceDetailPage() {
  return (
    <main className="min-h-screen">
      <Hero/>
      <ServiceProcessSection/>
      <ServiceCaseStudies/>
      <ServicePricing/>
      <ServiceFAQs/>
      <RelatedServices/>
    </main>
  );
}