const questions = [
  { question: "How do we start a conversation?", answer: "Share what you are trying to change, what you already know and where you feel uncertain. An initial discussion can help decide whether a deeper discovery or a defined piece of work would be useful." },
  { question: "Can we discuss sensitive details confidentially?", answer: "You can begin with a high-level description. If more detail is needed, raise confidentiality and information-handling expectations before sharing sensitive material so the right arrangements can be discussed." },
  { question: "What determines scope?", answer: "Scope depends on the goals, users, current environment, dependencies, risks and available capacity. These are discussed together before a proposal is prepared." },
  { question: "What happens after I send an inquiry?", answer: "The ADM team reviews the information you provide and follows up to understand the request and a sensible next step. Include your preferred contact details and timing if relevant." },
];

export default function PortfolioQuestions() {
  return (
    <section aria-labelledby="questions-title" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16"><div><span className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-200 sm:text-sm">Before the first conversation</span><h2 id="questions-title" className="mt-5 max-w-[10ch] text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">A few useful answers.</h2></div><div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-slate-900/60 px-5 shadow-xl shadow-black/20 sm:px-8">{questions.map((item) => <details key={item.question} className="group"><summary className="flex min-h-[68px] cursor-pointer list-none items-center gap-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 [&::-webkit-details-marker]:hidden"><span className="flex-1 text-base font-bold text-white sm:text-lg">{item.question}</span><span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-lg text-cyan-200 transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-slate-300">{item.answer}</p></details>)}</div></div>
    </section>
  );
}
