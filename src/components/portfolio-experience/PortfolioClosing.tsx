import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function PortfolioClosing() {
  return (
    <section className="relative flex justify-center overflow-hidden py-20 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.26),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.16),transparent_28%),linear-gradient(135deg,#020b17_0%,#071a2d_38%,#0c2342_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px] sm:[background-size:50px_50px]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-950/35 px-5 py-10 text-center shadow-2xl shadow-black/30 backdrop-blur-sm sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <span className="inline-flex max-w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-100 sm:px-5 sm:text-sm">A thoughtful first step</span>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">Bring the challenge. We&apos;ll help frame the next move.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base sm:leading-8 lg:text-lg">Tell us what feels complex, constrained or full of possibility. We can discuss your goals and explore a practical next step together.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Link href="/consultation" className="group site-button-primary min-h-14 px-6 py-4 text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl motion-reduce:transform-none sm:px-8"><CalendarDays className="h-5 w-5" aria-hidden="true" />Discuss a project<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" /></Link>
            <Link href="/contact" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-slate-900/30 px-6 py-4 text-base font-bold text-white backdrop-blur-xl transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:px-8">Contact ADM</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:mt-10 sm:grid-cols-4 sm:rounded-2xl">
            {["Technology", "Marketing", "AI", "Data"].map((item, index) => <div key={item} className={`px-2 py-4 sm:py-5 ${index !== 3 ? "border-r border-white/10" : ""}`}><p className="text-sm font-black text-white sm:text-base">{item}</p><p className="mt-1 text-xs text-slate-300">{["Digital systems", "Audience & experience", "Intelligent workflows", "Information & insight"][index]}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
