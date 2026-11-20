import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import ConnectedCapabilitiesStage from "./ConnectedCapabilitiesStage";

export default function PortfolioHero({ hasApprovedWork }: { hasApprovedWork: boolean }) {
  return (
    <section className="relative isolate border-b border-white/[0.07] px-5 pb-14 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:min-h-[calc(100svh-4.5rem)] lg:px-12 lg:pb-16 lg:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_35%,rgba(24,88,170,.22),transparent_40%),linear-gradient(120deg,#071322_0%,#050d1a_48%,#071a27_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(rgba(148,197,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,197,255,.12)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-5">
        <div className="relative z-10 max-w-[650px]">
          <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.25em] text-cyan-200"><span className="h-px w-8 bg-cyan-300" />ADM <span className="text-slate-500">/</span> Selected work</p>
          <h1 className="mt-7 max-w-[12ch] text-[clamp(3rem,7.3vw,6.8rem)] font-semibold leading-[.97] tracking-[-.065em] text-white">Where ambitious ideas <span className="text-cyan-200">take shape.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Technology, Marketing, AI and Data brought together around the problems teams need to solve.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={hasApprovedWork ? "#approved-work" : "#capability-stories"} className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
              {hasApprovedWork ? "Explore selected work" : "Explore our approach"}<ArrowDown size={17} aria-hidden="true" className="transition-transform group-hover:translate-y-0.5" />
            </Link>
            <Link href="/consultation" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-cyan-200/60 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">Discuss a project<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="mt-12 flex items-center gap-3 text-xs text-slate-400"><span aria-hidden="true" className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-40 motion-reduce:animate-none" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" /></span>Four disciplines. One connected way of thinking.</div>
        </div>
        <div className="relative -mx-3 sm:mx-0">
          <ConnectedCapabilitiesStage />
          <p className="mt-3 px-5 text-center text-[11px] leading-5 text-slate-500">An illustrative map of ADM capabilities, not a client project or product interface.</p>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1400px] justify-between border-t border-white/[0.08] pt-4 text-[10px] uppercase tracking-[.22em] text-slate-500 sm:mt-14"><span>Technology · Marketing · AI · Data</span><span>Independent digital studio</span></div>
    </section>
  );
}
