"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { filterPortfolioProjects, portfolioChoiceText } from "@/utils/portfolio-filters";
import type { PublicPortfolioProject, PortfolioChoice } from "./types";

function choiceText(value?: PortfolioChoice | null) { return portfolioChoiceText(value); }
function labelFor(value?: string) {
  const labels: Record<string, string> = { "client-project": "Client project", "adm-product": "ADM product", "anonymized-engagement": "Authorized anonymized engagement", "concept-prototype": "Concept / prototype" };
  return value ? labels[value] ?? "Approved work" : "Approved work";
}

export default function ApprovedWorkShowcase({ projects }: { projects: PublicPortfolioProject[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [industry, setIndustry] = useState("all");
  const categories = useMemo(() => [...new Set(projects.map((p) => choiceText(p.category)).filter(Boolean))].sort(), [projects]);
  const industries = useMemo(() => [...new Set(projects.flatMap((p) => (p.industries ?? []).map(choiceText)).filter(Boolean))].sort(), [projects]);
  const visible = useMemo(() => filterPortfolioProjects(projects, { search, capability: "all", category, industry, technology: "all" }), [projects, search, category, industry]);
  const hasFilters = Boolean(search || category !== "all" || industry !== "all");
  const featured = visible[0];
  const rest = visible.slice(1);
  function reset() { setSearch(""); setCategory("all"); setIndustry("all"); }

  return (
    <section id="approved-work" aria-labelledby="approved-work-heading" className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between sm:pb-9"><div><p className="text-[11px] font-semibold uppercase tracking-[.23em] text-cyan-200">Approved for public display</p><h2 id="approved-work-heading" className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Selected work</h2></div><p className="max-w-sm text-sm leading-6 text-slate-400">Each example shown here has passed ADM’s public-release review.</p></div>
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[.08] bg-white/[.025] p-3 sm:flex-row sm:items-center sm:p-4">
          <label className="relative min-w-0 flex-1"><span className="sr-only">Search approved work</span><Search aria-hidden="true" size={17} className="absolute left-3.5 top-3.5 text-slate-500"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search approved work" className="min-h-11 w-full rounded-xl border border-white/10 bg-[#071421] pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-200/70 focus:outline-none focus:ring-2 focus:ring-cyan-200/20"/>{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-2.5 min-h-8 min-w-8 rounded-full text-slate-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">×</button>}</label>
          {categories.length > 1 && <label><span className="sr-only">Filter by category</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="min-h-11 w-full rounded-xl border border-white/10 bg-[#071421] px-3 text-sm text-slate-200 focus:border-cyan-200/70 focus:outline-none focus:ring-2 focus:ring-cyan-200/20 sm:w-auto"><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
          {industries.length > 1 && <label><span className="sr-only">Filter by industry</span><select value={industry} onChange={(e) => setIndustry(e.target.value)} className="min-h-11 w-full rounded-xl border border-white/10 bg-[#071421] px-3 text-sm text-slate-200 focus:border-cyan-200/70 focus:outline-none focus:ring-2 focus:ring-cyan-200/20 sm:w-auto"><option value="all">All industries</option>{industries.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
          {hasFilters && <button type="button" onClick={reset} className="min-h-11 rounded-xl px-3 text-sm font-medium text-cyan-200 underline decoration-cyan-200/40 underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">Clear filters</button>}
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{visible.length} approved {visible.length === 1 ? "project" : "projects"} shown.</p>
        {featured ? <>
          <article className="mt-7 grid overflow-hidden rounded-[1.6rem] border border-white/[.1] bg-[#091724] lg:min-h-[440px] lg:grid-cols-[1.18fr_.82fr]">
            <div className="relative min-h-[250px] overflow-hidden bg-[radial-gradient(ellipse_at_40%_45%,rgba(34,211,238,.22),transparent_50%),linear-gradient(145deg,#102841,#071421)] sm:min-h-[360px] lg:min-h-[440px]">
              {featured.featuredImage?.url ? <Image src={featured.featuredImage.url} alt={featured.featuredImage.alt || `Approved visual for ${featured.title || "selected work"}`} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover"/> : <div aria-hidden="true" className="absolute inset-0 grid place-items-center"><svg viewBox="0 0 600 360" className="h-full w-full opacity-80"><path d="M80 260 185 110l95 92 70-77 170 142" fill="none" stroke="rgba(103,232,249,.65)" strokeWidth="2"/><path d="M75 280h450M110 245v-70m80 70v-120m80 120v-95m80 95V90m80 155v-55" stroke="rgba(147,197,253,.18)"/><circle cx="280" cy="202" r="50" fill="rgba(9,23,36,.6)" stroke="rgba(103,232,249,.35)"/><text x="280" y="207" textAnchor="middle" fill="#c7f9ff" fontSize="11" letterSpacing="4">ADM</text></svg><span className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[.2em] text-slate-500">Illustrative visual · no project image supplied</span></div>}
              <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#071421]/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[.16em] text-cyan-100 backdrop-blur">{labelFor(featured.classification)}</span>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-10"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500">Featured example</p><h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">{featured.title}</h3>{featured.clientName && <p className="mt-2 text-sm text-slate-400">{featured.clientName}</p>}<p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{featured.shortDescription}</p></div><div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5"><div className="flex flex-wrap gap-2">{featured.capabilities?.map((item) => <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{item}</span>)}</div>{featured.projectUrl && <a href={featured.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">Visit project <ArrowUpRight size={16} aria-hidden="true"/></a>}</div></div>
          </article>
          {rest.length > 0 && <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{rest.map((project, index) => <article key={project.id} className={`group overflow-hidden rounded-2xl border border-white/[.09] bg-[#091724] ${index === 0 && rest.length > 2 ? "sm:row-span-2" : ""}`}>
            <div className={`relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,rgba(34,211,238,.18),transparent_50%),linear-gradient(145deg,#102841,#071421)] ${index === 0 && rest.length > 2 ? "aspect-[4/3] sm:h-full sm:min-h-[340px]" : "aspect-[16/10]"}`}>{project.featuredImage?.url ? <Image src={project.featuredImage.url} alt={project.featuredImage.alt || `Approved visual for ${project.title || "selected work"}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"/> : <div aria-hidden="true" className="absolute inset-0 grid place-items-center"><span className="font-mono text-5xl font-light text-cyan-100/70">{String(index + 2).padStart(2, "0")}</span></div>}<span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#071421]/80 px-3 py-1.5 text-[9px] uppercase tracking-[.16em] text-cyan-100 backdrop-blur">{labelFor(project.classification)}</span></div>
            <div className="p-5 sm:p-6"><h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>{project.clientName && <p className="mt-1 text-xs text-slate-400">{project.clientName}</p>}<p className="mt-3 text-sm leading-6 text-slate-300">{project.shortDescription}</p>{project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">Visit project <ArrowUpRight size={15} aria-hidden="true"/></a>}</div>
          </article>)}</div>}
        </> : <div className="mt-8 rounded-2xl border border-white/10 px-6 py-12 text-center"><p className="text-xl font-medium">No approved examples match this search.</p><button type="button" onClick={reset} className="mt-4 min-h-11 rounded-full border border-cyan-200/40 px-5 text-sm font-semibold text-cyan-100 hover:bg-cyan-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">Clear filters</button></div>}
      </div>
    </section>
  );
}
