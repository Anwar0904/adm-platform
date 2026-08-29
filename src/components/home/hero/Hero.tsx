"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Code2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  NOTE ON IMAGES                                                     */
/*  Swap every `src="/images/hero/*"` below for your real assets.      */
/*  Recommended source sizes:                                          */
/*    - laptop-dashboard.jpg  -> 900x700  (landscape)                  */
/*    - building.jpg          -> 900x1100 (portrait, tall)             */
/*    - team.jpg               -> 800x700  (landscape)                 */
/*    - app-screen.jpg         -> 600x1200 (phone screenshot)          */
/* ------------------------------------------------------------------ */


const TRUSTED_BY = [
  { name: "Uneed", icon: "u" },
  { name: "Cactus", icon: "cactus" },
  { name: "cloudwatch", icon: "cloud" },
  { name: "Volume", icon: "check" },
  { name: "SnapShot", icon: "gear" },
];

export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#04060c]">
      {/* ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(37,99,235,0.18),transparent_45%),radial-gradient(circle_at_10%_80%,rgba(37,99,235,0.10),transparent_40%)]" />



      {/* ============================================================
          HERO CONTENT
      ============================================================= */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-8 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-32 lg:pt-14 lg:px-8">
        {/* ---------------- LEFT: copy ---------------- */}
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Digital solutions that drive real growth
          </div>

          <h1 className="max-w-xl text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            We Build Digital Products That Drive{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Business Forward
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
            From powerful websites to <span className="font-semibold text-slate-200">AI automation</span> and{" "}
            <span className="font-semibold text-slate-200">custom software</span>, we help brands scale smarter
            with technology.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Explore Our Services
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/work"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              See Our Work
            </Link>
          </div>

          <div className="mt-14">
            <p className="mb-4 text-xs font-medium text-slate-500">Trusted by growing brands</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {TRUSTED_BY.map((brand) => (
                <span
                  key={brand.name}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
                >
                  <TrustedIcon type={brand.icon} />
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: image collage ---------------- */}
        <div className="relative mx-auto h-[520px] w-full max-w-[560px] sm:h-[640px] lg:mx-0 lg:h-[720px] lg:max-w-none">
          {/* dashed connector line */}
          <svg
            className="pointer-events-none absolute -bottom-2 left-0 h-40 w-40 -z-10 sm:h-48 sm:w-48"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M10 190 C 40 150, 20 100, 90 60"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.7"
            />
            <circle cx="10" cy="190" r="5" fill="#3b82f6" />
          </svg>

          {/* building — main background image */}
          <div className="absolute left-0 top-[12%] h-[62%] w-[64%] overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
            <Image
              src="/home/building.jpeg"
              alt="Modern glass building at dusk"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover"
            />
          </div>

          {/* laptop dashboard — top right */}
          <div className="absolute right-0 top-0 h-[38%] w-[54%] overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
            <Image
              src="/home/laptop.jpeg"
              alt="Laptop showing an analytics dashboard"
              fill
              sizes="(max-width: 1024px) 50vw, 26vw"
              className="object-cover"
            />
          </div>

          {/* team photo — bottom left */}
          <div className="absolute bottom-0 left-[6%] h-[30%] w-[46%] overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
            <Image
              src="/home/team.jpeg"
              alt="Team collaborating around a laptop"
              fill
              sizes="(max-width: 1024px) 44vw, 22vw"
              className="object-cover"
            />
          </div>

          {/* phone mockup — bottom right */}
          <div className="absolute bottom-[6%] right-0 h-[38%] w-[33%] overflow-hidden rounded-[2rem] border-4 border-white/90 shadow-2xl shadow-black/40">
            <Image
              src="/home/app-screen.jpeg"
              alt="Mobile app screen reading Digital Experience Reimagined"
              fill
              sizes="(max-width: 1024px) 30vw, 22vw"
              className="object-fill"
            />
          </div>

          {/* floating card — AI Automation */}
          <FloatingCard
            className="left-[2%] top-[2%] w-[58%] sm:w-[52%]"
            icon={<Sparkles size={18} />}
            title="AI Automation"
            subtitle="Smarter Workflows"
          />

          {/* floating card — 98% Client Satisfaction */}
          <FloatingCard
            className="right-[-4%] top-[44%] w-[56%] sm:w-[50%]"
            icon={<BarChart3 size={18} />}
            title="98%"
            titleClassName="text-emerald-500"
            subtitle="Client Satisfaction"
          />

          {/* floating card — Custom Software */}
          <FloatingCard
            className="bottom-[-2%] left-[26%] w-[58%] sm:w-[52%]"
            icon={<Code2 size={18} />}
            title="Custom Software"
            subtitle="Built for Scale"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                      */
/* ------------------------------------------------------------------ */

function FloatingCard({
  className = "",
  icon,
  title,
  titleClassName = "text-slate-900",
  subtitle,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  titleClassName?: string;
  subtitle: string;
}) {
  return (
    <div
      className={`absolute z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-xl shadow-black/20 ${className}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {icon}
      </span>
      <span className="min-w-0">
        <span className={`block text-base font-bold leading-tight ${titleClassName}`}>
          {title}
        </span>
        <span className="block text-xs font-medium text-slate-500">{subtitle}</span>
      </span>
    </div>
  );
}

function TrustedIcon({ type }: { type: string }) {
  const common = "h-4 w-4 shrink-0 text-slate-500";
  switch (type) {
    case "u":
      return <span className={`${common} flex items-center justify-center rounded-full border border-slate-500 text-[10px]`}>U</span>;
    case "cactus":
      return <span className={common}>🌵</span>;
    case "cloud":
      return <span className={common}>☁️</span>;
    case "check":
      return <span className={common}>✔</span>;
    case "gear":
      return <span className={common}>⚙️</span>;
    default:
      return null;
  }
}