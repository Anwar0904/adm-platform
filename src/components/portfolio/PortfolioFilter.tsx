// src/components/portfolio/PortfolioFilter.tsx

"use client";

import { useMemo, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";


const categories = [
  "All",
  "Web Applications",
  "AI Solutions",
  "SaaS Platforms",
  "E-Commerce",
  "Mobile Apps",
  "Enterprise",
];

const industries = [
  "All Industries",
  "Healthcare",
  "Education",
  "Finance",
  "Real Estate",
  "Retail",
  "Government",
];

const technologies = [
  "Next.js",
  "React",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "AI",
  "Python",
  "AWS",
];

export default function PortfolioFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [industry, setIndustry] = useState("All Industries");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const activeFilters = useMemo(() => {
    let count = 0;

    if (category !== "All") count++;
    if (industry !== "All Industries") count++;
    count += selectedTech.length;

    return count;
  }, [category, industry, selectedTech]);

  const toggleTechnology = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech)
        ? prev.filter((item) => item !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setIndustry("All Industries");
    setSelectedTech([]);
  };

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-[0_20px_80px_rgba(37,99,235,0.08)]">
          {/* Header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
                  Discover Projects
                </p>

                <h2 className="text-3xl font-bold md:text-4xl">
                  Filter Our Portfolio
                </h2>

                <p className="mt-3 max-w-2xl text-blue-100">
                  Browse our work by technology, industry, or solution type.
                  Instantly find projects relevant to your business.
                </p>
              </div>

              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                  Clear Filters ({activeFilters})
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="border-b border-slate-100 p-8">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, industries, technologies..."
                className="h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-6 text-base outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid gap-10 p-8 lg:grid-cols-2">
            {/* Category */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />

                <h3 className="font-semibold text-slate-900">
                  Project Category
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm font-medium transition-all",
                      category === item
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />

                <h3 className="font-semibold text-slate-900">
                  Industry
                </h3>
              </div>

              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 outline-none transition focus:border-blue-500"
              >
                {industries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Technology Tags */}
          <div className="border-t border-slate-100 bg-slate-50 p-8">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Technologies Used
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Select one or multiple technologies.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTechnology(tech)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                    selectedTech.includes(tech)
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "border-white bg-white hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
);
}