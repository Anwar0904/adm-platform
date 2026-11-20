"use client";

import { useState } from "react";

const capabilities = [
  { name: "Technology", short: "Build", problem: "Disconnected tools make everyday work harder than it needs to be.", approach: "Map the people, systems and constraints first; then shape a maintainable digital product or integration." },
  { name: "Marketing", short: "Reach", problem: "A useful offer can get lost across fragmented digital journeys.", approach: "Bring audience, content and measurement into a coherent experience that can be improved over time." },
  { name: "AI", short: "Augment", problem: "Teams see automation potential but need to know where it is appropriate.", approach: "Find a bounded use case, review its data and risks, and define a practical path to evaluation." },
  { name: "Data", short: "Understand", problem: "Important signals are scattered across reports, platforms and workflows.", approach: "Clarify the decisions that matter, then organize the data and reporting around them." },
] as const;

export default function ConnectedCapabilitiesStage() {
  const [active, setActive] = useState(0);
  const chosen = capabilities[active];

  return (
    <div className="relative mx-auto max-w-[700px] rounded-[2rem] border border-white/[0.12] bg-[#071522]/80 p-4 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm sm:p-6 lg:p-7">
      <div className="flex items-start justify-between gap-4 px-1 sm:px-2">
        <div><p className="text-[10px] font-semibold uppercase tracking-[.24em] text-cyan-200">Connected systems</p><p className="mt-1 text-xs text-slate-400">Explore the intersections</p></div>
        <span aria-hidden="true" className="mt-1 flex gap-1"><i className="h-1 w-1 rounded-full bg-cyan-200"/><i className="h-1 w-1 rounded-full bg-blue-300/60"/><i className="h-1 w-1 rounded-full bg-violet-300/60"/></span>
      </div>
      <div className="relative mt-4 aspect-[1.38/1] overflow-hidden rounded-2xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_center,rgba(24,87,145,.24),transparent_58%),linear-gradient(135deg,rgba(17,38,58,.7),rgba(6,17,29,.8))] sm:aspect-[1.58/1]">
        <svg aria-hidden="true" viewBox="0 0 600 380" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-cyan-200/30">
          <defs><linearGradient id="capability-flow" x1="0" x2="1"><stop stopColor="#60a5fa" stopOpacity=".15"/><stop offset=".52" stopColor="#67e8f9" stopOpacity=".9"/><stop offset="1" stopColor="#a78bfa" stopOpacity=".25"/></linearGradient></defs>
          <path d="M110 100 C210 100 210 190 300 190 S390 100 490 100 M110 280 C210 280 210 190 300 190 S390 280 490 280 M110 100 C90 170 90 210 110 280 M490 100 C510 170 510 210 490 280" fill="none" stroke="url(#capability-flow)" strokeWidth="1.4" strokeDasharray="5 7" className="capability-path"/>
          <circle cx="300" cy="190" r="80" fill="none" stroke="rgba(103,232,249,.08)"/><circle cx="300" cy="190" r="58" fill="none" stroke="rgba(103,232,249,.12)"/>
          <circle cx="110" cy="100" r="4" fill="#67e8f9"/><circle cx="490" cy="100" r="4" fill="#93c5fd"/><circle cx="110" cy="280" r="4" fill="#c4b5fd"/><circle cx="490" cy="280" r="4" fill="#67e8f9"/>
        </svg>
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full border border-cyan-200/30 bg-[#0a2030]/90 text-center shadow-[0_0_55px_rgba(34,211,238,.15)] sm:h-[30%] sm:w-[30%]"><span className="text-[9px] uppercase tracking-[.18em] text-slate-400">ADM</span><span className="mt-0.5 text-[11px] font-medium text-white sm:text-sm">Useful systems</span></div>
        {capabilities.map((item, index) => {
          const positions = ["left-[4%] top-[17%]", "right-[4%] top-[17%]", "left-[4%] bottom-[17%]", "right-[4%] bottom-[17%]"];
          const selected = active === index;
          return <button key={item.name} type="button" onClick={() => setActive(index)} aria-pressed={selected} className={`absolute z-10 flex min-h-11 min-w-[118px] flex-col justify-center rounded-xl border px-3 py-2 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:min-w-[145px] sm:px-4 ${positions[index]} ${selected ? "border-cyan-200/70 bg-[#103248] shadow-[0_0_28px_rgba(34,211,238,.15)]" : "border-white/10 bg-[#091827]/90 hover:border-white/30"}`}>
            <span className={`text-[9px] font-semibold uppercase tracking-[.16em] sm:text-[10px] ${selected ? "text-cyan-200" : "text-slate-400"}`}>{item.short}</span><span className="mt-0.5 text-xs font-semibold text-white sm:text-sm">{item.name}</span>
          </button>;
        })}
      </div>
      <div aria-live="polite" aria-atomic="true" className="mt-4 grid gap-4 border-t border-white/[0.08] px-1 pt-4 sm:grid-cols-[.8fr_1.2fr] sm:px-2">
        <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-200">The challenge</p><p className="mt-1.5 text-sm leading-6 text-slate-200">{chosen.problem}</p></div>
        <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-cyan-200">A possible approach</p><p className="mt-1.5 text-sm leading-6 text-slate-300">{chosen.approach}</p></div>
      </div>
    </div>
  );
}
