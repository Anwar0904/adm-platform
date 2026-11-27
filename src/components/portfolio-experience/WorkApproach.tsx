import { ArrowUpRight, Code2, Search, ShieldCheck, Shapes, TrendingUp } from "lucide-react";

const stages = [
  { no: "01", title: "Understand", note: "Get close to the context.", detail: "Talk through the goals, users, existing systems and constraints. The first task may be clarifying what is actually getting in the way.", icon: Search },
  { no: "02", title: "Shape", note: "Make the next move tangible.", detail: "Compare possible directions, agree what belongs in scope and identify the questions that need answers before work begins.", icon: Shapes },
  { no: "03", title: "Build", note: "Work in reviewable increments.", detail: "Develop the agreed experience or system in a way that makes progress visible and gives the team regular opportunities to respond.", icon: Code2 },
  { no: "04", title: "Validate", note: "Check against real needs.", detail: "Review the result with the people who will use or operate it. Testing and checks are shaped around the particular work.", icon: ShieldCheck },
  { no: "05", title: "Evolve", note: "Plan for what comes next.", detail: "Discuss launch, handover, measurement and future iteration in the context of the team's capacity and priorities.", icon: TrendingUp },
];

export default function WorkApproach() {
  return (
    <section aria-labelledby="approach-title" className="border-y border-white/10 bg-slate-900/35 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-200 sm:text-sm">How work comes together</span>
          <h2 id="approach-title" className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">A clear path, shaped to the work.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">The sequence is a guide for collaboration, not a fixed recipe. The right depth and pace depend on what the team needs to learn and make.</p>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-blue-600/30 via-cyan-300/70 to-blue-600/30 xl:block" />
          <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5 xl:gap-4">
            {stages.map(({ no, title, note, detail, icon: Icon }) => <li key={no} className="group relative rounded-2xl border border-white/10 bg-slate-950/65 p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-blue-900/20 sm:p-6">
              <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/40 transition-transform duration-300 group-hover:scale-105"><Icon className="h-6 w-6" aria-hidden="true" /></div>
              <p className="text-xs font-bold tracking-wider text-blue-300">STEP {no}</p>
              <h3 className="mt-2 text-xl font-black tracking-tight text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{note}</p>
              <details className="group/details mt-4 border-t border-white/10 pt-3">
                <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200 [&::-webkit-details-marker]:hidden"><span className="flex-1">What this can involve</span><ArrowUpRight className="h-4 w-4 transition-transform group-open/details:rotate-45" aria-hidden="true" /></summary>
                <p className="pt-2 text-sm leading-6 text-slate-400">{detail}</p>
              </details>
            </li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}
