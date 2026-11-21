import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import ConnectedCapabilitiesStage from "./ConnectedCapabilitiesStage";

export default function PortfolioHero({ hasApprovedWork }: { hasApprovedWork: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.12),transparent_28%),linear-gradient(180deg,#040b15_0%,#071423_38%,#091827_100%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.1] [background-image:linear-gradient(rgba(148,197,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,197,255,.14)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      <div className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            <Sparkles className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            ADM <span aria-hidden="true">/</span> Selected Work
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Where ambitious ideas <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 bg-clip-text text-transparent">take shape.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Arazi Digital Media brings Technology, Marketing, AI and Data together around the problems teams need to solve.</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href={hasApprovedWork ? "#approved-work" : "#capability-stories"} className="group site-button-primary min-h-12 px-6 py-3.5 text-sm transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transform-none">
              {hasApprovedWork ? "Explore selected work" : "Explore our approach"}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </Link>
            <Link href="/consultation" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-blue-400 hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Discuss a project <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <p className="mt-10 flex items-center gap-3 text-sm font-medium text-slate-200"><span aria-hidden="true" className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-40 motion-reduce:animate-none" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" /></span>Four disciplines. One connected way of thinking.</p>
        </div>

        <div className="relative mx-auto w-full max-w-2xl pt-2 lg:pt-10">
          <ConnectedCapabilitiesStage />
          <p className="mt-4 text-center text-xs leading-5 text-slate-400">An illustrative capability map, not a client project or product interface.</p>
        </div>
        <div className="col-span-full flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-[.15em] text-slate-400"><span>Technology <span className="text-blue-400">·</span> Marketing <span className="text-blue-400">·</span> AI <span className="text-blue-400">·</span> Data</span><span>Arazi Digital Media</span></div>
      </div>
    </section>
  );
}
