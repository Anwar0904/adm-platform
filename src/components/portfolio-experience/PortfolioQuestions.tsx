const questions = [
  { question: "How do we start a conversation?", answer: "Share what you are trying to change, what you already know and where you feel uncertain. An initial discussion can help decide whether a deeper discovery or a defined piece of work would be useful." },
  { question: "Can we discuss sensitive details confidentially?", answer: "You can begin with a high-level description. If more detail is needed, raise confidentiality and information-handling expectations before sharing sensitive material so the right arrangements can be discussed." },
  { question: "What determines scope?", answer: "Scope depends on the goals, users, current environment, dependencies, risks and available capacity. These are discussed together before a proposal is prepared." },
  { question: "What happens after I send an inquiry?", answer: "The ADM team reviews the information you provide and follows up to understand the request and a sensible next step. Include your preferred contact details and timing if relevant." },
];

export default function PortfolioQuestions() {
  return (
    <section aria-labelledby="questions-title" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20"><div><p className="text-[11px] font-semibold uppercase tracking-[.23em] text-cyan-200">Before the first conversation</p><h2 id="questions-title" className="mt-4 max-w-[10ch] text-4xl font-semibold leading-[1.04] tracking-[-.05em] sm:text-5xl">A few useful answers.</h2></div><div className="divide-y divide-white/10 border-y border-white/10">{questions.map((item) => <details key={item.question} className="group"><summary className="flex min-h-[68px] cursor-pointer list-none items-center gap-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 [&::-webkit-details-marker]:hidden"><span className="flex-1 text-base font-medium sm:text-lg">{item.question}</span><span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-lg text-cyan-200 transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-slate-300">{item.answer}</p></details>)}</div></div>
    </section>
  );
}
