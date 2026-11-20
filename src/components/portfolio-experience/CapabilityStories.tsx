const stories = [
  { no: "01", name: "Technology", eyebrow: "Make the moving parts work together", challenge: "A growing operation depends on tools and handoffs that were never designed to work as one.", response: "Explore the product, platform or integration changes that could make the work clearer and more dependable.", motif: "architecture" },
  { no: "02", name: "Marketing", eyebrow: "Connect the experience to the intention", challenge: "People encounter an organization through disconnected pages, messages and campaigns.", response: "Map the journey, clarify the message and consider how digital channels can support the next useful action.", motif: "journey" },
  { no: "03", name: "Artificial intelligence", eyebrow: "Find the useful, bounded application", challenge: "There may be repetitive work or information bottlenecks, but the right role for AI is not yet clear.", response: "Assess the task, available data, human oversight and risks before deciding whether an AI or automation pilot makes sense.", motif: "intelligence" },
  { no: "04", name: "Data", eyebrow: "Give decisions a clearer foundation", challenge: "Signals live in multiple systems, and teams spend time reconciling them before they can act.", response: "Start with the decisions people need to make, then discuss collection, quality, analysis and reporting that could support them.", motif: "data" },
] as const;

function Motif({ kind }: { kind: (typeof stories)[number]["motif"] }) {
  if (kind === "architecture") return <svg viewBox="0 0 280 160" className="h-full w-full" aria-hidden="true"><path d="M30 80h62m0 0 30-38m-30 38 30 38m0-76h65m-65 76h65m0-76 34 38-34 38" fill="none" stroke="rgba(103,232,249,.55)" strokeWidth="1.5"/><g fill="#0c2838" stroke="#67e8f9"><rect x="10" y="64" width="40" height="32" rx="8"/><rect x="98" y="25" width="48" height="30" rx="8"/><rect x="98" y="105" width="48" height="30" rx="8"/><rect x="178" y="64" width="52" height="32" rx="8"/></g><circle cx="250" cy="80" r="7" fill="#67e8f9"/></svg>;
  if (kind === "journey") return <svg viewBox="0 0 280 160" className="h-full w-full" aria-hidden="true"><path d="M20 115c45 0 39-70 84-70s37 75 80 75 35-40 76-40" fill="none" stroke="rgba(147,197,253,.8)" strokeWidth="2" strokeDasharray="4 6"/><circle cx="20" cy="115" r="8" fill="#67e8f9"/><circle cx="104" cy="45" r="8" fill="#93c5fd"/><circle cx="184" cy="120" r="8" fill="#c4b5fd"/><circle cx="260" cy="80" r="8" fill="#67e8f9"/><path d="M20 140h240" stroke="rgba(255,255,255,.12)"/></svg>;
  if (kind === "intelligence") return <svg viewBox="0 0 280 160" className="h-full w-full" aria-hidden="true"><circle cx="140" cy="80" r="28" fill="#102b3d" stroke="#67e8f9"/><circle cx="140" cy="80" r="7" fill="#67e8f9"/><g fill="#0a1b2b" stroke="rgba(167,139,250,.75)"><circle cx="60" cy="45" r="13"/><circle cx="60" cy="115" r="13"/><circle cx="220" cy="45" r="13"/><circle cx="220" cy="115" r="13"/></g><path d="m73 50 41 20m-41 40 41-20m52-10 42-30m-42 30 42 30" stroke="rgba(103,232,249,.5)"/><path d="M140 15v30m0 70v30" stroke="rgba(255,255,255,.16)" strokeDasharray="3 5"/></svg>;
  return <svg viewBox="0 0 280 160" className="h-full w-full" aria-hidden="true"><path d="M34 128V78h30v50m18 0V42h30v86m18 0V62h30v66m18 0V25h30v103m18 0V52h30v76" fill="none" stroke="rgba(103,232,249,.58)" strokeWidth="2"/><path d="M26 136h230" stroke="rgba(255,255,255,.2)"/><path d="m30 63 48-25 48 12 48-27 52 20" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="4 5"/></svg>;
}

export default function CapabilityStories({ unavailable }: { unavailable: boolean }) {
  return (
    <section id="capability-stories" aria-labelledby="capability-stories-title" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-7 border-b border-white/10 pb-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end lg:pb-14">
          <div><p className="text-[11px] font-semibold uppercase tracking-[.24em] text-cyan-200">A studio for connected challenges</p><h2 id="capability-stories-title" className="mt-4 max-w-[14ch] text-4xl font-semibold leading-[1.04] tracking-[-.045em] sm:text-5xl lg:text-6xl">Ways we turn complexity into useful systems.</h2></div>
          <div className="max-w-xl lg:justify-self-end"><p className="text-base leading-7 text-slate-300 sm:text-lg">The work often begins between disciplines: where a tool, a customer journey, an intelligent workflow and a decision all meet.</p><p className="mt-4 text-sm leading-6 text-slate-400">{unavailable ? "The public project catalogue is temporarily unavailable. This overview describes ADM’s capabilities and does not imply that any project example has been approved." : "Public project examples are shared when publication permissions allow."}</p></div>
        </div>
        <div className="divide-y divide-white/10">
          {stories.map((story, i) => <article key={story.name} className={`grid gap-6 py-9 sm:py-12 lg:grid-cols-[.16fr_.84fr] lg:gap-10 ${i % 2 ? "" : ""}`}>
            <div className="flex items-start gap-4 lg:block"><span className="font-mono text-xs tracking-widest text-cyan-200">{story.no}</span><span className="h-px w-8 translate-y-2 bg-cyan-200/50 lg:mt-6 lg:block" /></div>
            <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-12">
              <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500">{story.eyebrow}</p><h3 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{story.name}</h3><p className="mt-5 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">{story.challenge}</p></div>
              <div className="grid min-h-[210px] overflow-hidden rounded-2xl border border-white/[.08] bg-[#081725] sm:grid-cols-[.75fr_1.25fr]">
                <div className="flex items-center justify-center border-b border-white/[.06] px-6 py-5 sm:border-b-0 sm:border-r"><p className="max-w-xs text-sm leading-6 text-slate-300">{story.response}</p></div>
                <div className="relative flex min-h-[145px] items-center justify-center p-5"><div className="absolute inset-0 opacity-80 [background:radial-gradient(ellipse_at_center,rgba(34,211,238,.1),transparent_65%)]"/><Motif kind={story.motif}/><span className="absolute bottom-3 right-4 text-[9px] uppercase tracking-[.2em] text-slate-600">Illustrative system map</span></div>
              </div>
            </div>
          </article>)}
        </div>
        <p className="mt-8 border-l border-cyan-200/50 pl-4 text-sm leading-6 text-slate-400">These are examples of challenges ADM can help explore. They are not descriptions of completed client engagements.</p>
      </div>
    </section>
  );
}
