const stages = [
  { no: "01", title: "Understand", note: "Get close to the context.", detail: "Talk through the goals, users, existing systems and constraints. The first task may be clarifying what is actually getting in the way." },
  { no: "02", title: "Shape", note: "Make the next move tangible.", detail: "Compare possible directions, agree what belongs in scope and identify the questions that need answers before work begins." },
  { no: "03", title: "Build", note: "Work in reviewable increments.", detail: "Develop the agreed experience or system in a way that makes progress visible and gives the team regular opportunities to respond." },
  { no: "04", title: "Validate", note: "Check against real needs.", detail: "Review the result with the people who will use or operate it. Testing and checks are shaped around the particular work." },
  { no: "05", title: "Evolve", note: "Plan for what comes next.", detail: "Discuss launch, handover, measurement and future iteration in the context of the team's capacity and priorities." },
];

export default function WorkApproach() {
  return (
    <section aria-labelledby="approach-title" className="border-y border-white/[.07] bg-[#081522] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start"><p className="text-[11px] font-semibold uppercase tracking-[.23em] text-cyan-200">How work comes together</p><h2 id="approach-title" className="mt-4 max-w-[11ch] text-4xl font-semibold leading-[1.04] tracking-[-.05em] sm:text-5xl">A clear path, shaped to the work.</h2><p className="mt-6 max-w-md text-base leading-7 text-slate-300">The sequence is a guide for collaboration, not a fixed recipe. The right depth and pace depend on what the team needs to learn and make.</p></div>
        <ol className="relative border-l border-cyan-200/20 pl-6 sm:pl-9">{stages.map((stage) => <li key={stage.no} className="relative border-b border-white/[.08] py-6 first:pt-0 last:border-0 last:pb-0 sm:py-8"><span aria-hidden="true" className="absolute -left-[31px] top-8 h-2.5 w-2.5 rounded-full border border-cyan-200 bg-[#081522] shadow-[0_0_16px_rgba(103,232,249,.55)] sm:-left-[43px]"/><details className="group"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 [&::-webkit-details-marker]:hidden"><span className="font-mono text-xs text-cyan-200">{stage.no}</span><span className="flex-1"><span className="block text-2xl font-semibold tracking-tight">{stage.title}</span><span className="mt-1 block text-sm text-slate-400">{stage.note}</span></span><span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-lg text-cyan-200 transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-2 pl-10 pt-3 text-sm leading-7 text-slate-300 sm:pl-[3.25rem]">{stage.detail}</p></details></li>)}</ol>
      </div>
    </section>
  );
}
