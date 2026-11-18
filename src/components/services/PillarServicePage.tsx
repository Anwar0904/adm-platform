import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Hero from "@/components/service-detail/Hero";
import { RelatedServices } from "@/components/service-detail/related-services";
import { pillarServices, type PillarSlug } from "./pillar-services";

type PillarService = (typeof pillarServices)[PillarSlug];

export default function PillarServicePage({ service }: { service: PillarService }) {
  const relatedServices = Object.values(pillarServices)
    .filter((item) => item.slug !== service.slug)
    .map((item) => ({
      slug: item.slug,
      title: item.pillar,
      shortDescription: item.shortDescription,
    }));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Hero
        service={{
          ...service,
          seo: { metaTitle: service.pillar },
          featureList: service.features.map(({ title }) => ({ title })),
        }}
      />

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[28px] border border-white/10 bg-slate-900/70 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.5)] backdrop-blur-sm">
              <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                {service.pillar} Overview
              </span>
              <div className="mt-8 space-y-5 text-base leading-8 text-slate-300">
                {service.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <aside className="rounded-[28px] border border-blue-500/20 bg-linear-to-br from-blue-600/15 via-slate-900/80 to-cyan-500/10 p-8 shadow-[0_30px_80px_rgba(37,99,235,0.12)]">
              <h2 className="text-2xl font-black text-white">Services within {service.pillar}</h2>
              <div className="mt-7 space-y-4">
                {service.features.map((feature, index) => (
                  <div key={feature.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-cyan-300">{index + 1}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-slate-900/70 p-8 sm:p-10">
          <h2 className="text-2xl font-black text-white sm:text-3xl">Discuss a {service.pillar} project</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">Tell us about the business need, users and constraints. ADM can discuss a suitable scope and the information needed to plan the work.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-300 transition hover:gap-3 hover:text-blue-200">Talk to ADM <ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">FAQs</span>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Common {service.pillar} questions</h2>
          </div>
          <div className="space-y-4">
            {service.faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
                <h3 className="flex items-start gap-3 text-lg font-bold text-white"><CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-blue-300" size={18} />{faq.question}</h3>
                <p className="mt-3 pl-8 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RelatedServices services={relatedServices} />
    </main>
  );
}
