import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const disciplines = [
  { no: "01", title: "Technology", detail: "Products, platforms and integrations" },
  { no: "02", title: "Marketing", detail: "Digital journeys and communication" },
  { no: "03", title: "Artificial intelligence", detail: "Useful, carefully scoped applications" },
  { no: "04", title: "Data", detail: "Clearer signals for better decisions" },
];

export default function PortfolioSection() {
  return (
    <section className="section-shell light-panel">
      <div className="section-content">
        <div className="grid gap-10 border-b border-slate-700/50 pb-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div><span className="section-kicker">Portfolio</span><h2 className="section-title max-w-3xl">Complex challenges need connected thinking.</h2></div>
          <div className="max-w-xl lg:justify-self-end"><p className="section-copy mt-0">ADM works across Technology, Marketing, AI and Data. Public project examples are shared when publication permissions allow.</p><Link href="/portfolio" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">Explore the ADM approach<ArrowUpRight size={17} aria-hidden="true"/></Link></div>
        </div>
        <div className="mt-8 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4">{disciplines.map((item) => <div key={item.no} className="flex gap-4 border-b border-slate-700/40 py-5 xl:border-b-0"><span className="pt-1 font-mono text-xs text-cyan-300">{item.no}</span><div><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-1 text-sm text-slate-400">{item.detail}</p></div></div>)}</div>
      </div>
    </section>
  );
}
