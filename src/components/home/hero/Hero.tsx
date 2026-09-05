"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Code2,
} from "lucide-react";
import { profile } from "@/config/profile";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#171311_0%,#241a16_42%,#171616_100%)]">
      {/* ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(239,155,47,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,113,133,0.11),transparent_28%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:auto,auto,44px_44px,44px_44px]" />



      {/* ============================================================
          HERO CONTENT
      ============================================================= */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-8 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-32 lg:pt-14 lg:px-8">
        {/* ---------------- LEFT: copy ---------------- */}
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-amber-300/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-100 shadow-sm shadow-amber-500/10 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            {profile.availability}
          </div>

          <h1 className="max-w-xl text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Hi, I&apos;m {profile.name}.{" "}
            <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-rose-200 bg-clip-text text-transparent">
              {profile.title}
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
            {profile.shortIntroduction}
          </p>

          <div className="mt-6 flex max-w-xl flex-wrap gap-2" aria-label="Primary technologies">
            {profile.technologyGroups[0].technologies.slice(0, 6).map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-amber-200/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-amber-100"
              >
                {technology}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-700 to-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform duration-200 hover:-translate-y-0.5"
            >
              Explore My Expertise
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-xl border border-amber-100/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-stone-100 transition-colors hover:bg-amber-100/10"
            >
              View Selected Projects
            </Link>
          </div>

          <div className="mt-14">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              Based {profile.location.toLowerCase()}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
              <Link href="/contact" className="underline decoration-blue-400/60 underline-offset-4 hover:text-cyan-300">
                Start a conversation
              </Link>
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-cyan-300">
                  GitHub
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-300">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: image collage ---------------- */}
        <div className="relative mx-auto h-[470px] w-full max-w-[500px] sm:h-[560px] lg:mx-0 lg:h-[620px] lg:max-w-none">
          {/* dashed connector line */}
          <svg
            className="pointer-events-none absolute bottom-2 left-2 h-28 w-28 -z-10 opacity-80 sm:h-36 sm:w-36"
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
          <div className="absolute left-0 top-[16%] h-[40%] w-[80%] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/home/building.jpeg"
              alt="Modern glass building at dusk"
              fill
              sizes="(max-width: 1024px) 60vw, 30vw"
              className="object-cover"
            />
          </div>

          {/* laptop dashboard — top right */}
          <div className="absolute right-20 top-0 h-[26%] w-[46%] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/home/laptop.jpeg"
              alt="Laptop showing an analytics dashboard"
              fill
              sizes="(max-width: 1024px) 50vw, 26vw"
              className="object-cover"
            />
          </div>

          {/* team photo — bottom left */}
          <div className="absolute bottom-33 left-[8%] h-[28%] w-[42%] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/home/team.jpeg"
              alt="Team collaborating around a laptop"
              fill
              sizes="(max-width: 1024px) 44vw, 22vw"
              className="object-cover"
            />
          </div>

          {/* phone mockup — bottom right */}
          <div className="absolute top-[43%] right-[15%] h-[40%] w-[30%] overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl shadow-black/40">
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
            className="left-[6%] top-[2%] w-[38%] sm:w-[38%]"
            icon={<Sparkles size={18} />}
            title="Frontend + Backend"
            subtitle="Product-minded engineering"
          />

          {/* floating card — 98% Organization Satisfaction */}
          <FloatingCard
            className="right-[-2%] top-[32%] w-[36%] sm:w-[36%]"
            icon={<BarChart3 size={18} />}
            title="APIs"
            titleClassName="text-emerald-500"
            subtitle="Designed to be dependable"
          />

          {/* floating card — Custom Software */}
          <FloatingCard
            className="bottom-[10%] left-[24%] w-[45%] sm:w-[46%]"
            icon={<Code2 size={18} />}
            title="Ship + Improve"
            subtitle="From idea to production"
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
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 shadow-xl shadow-blue-900/30 backdrop-blur-md ${className}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-cyan-300">
        {icon}
      </span>
      <span className="min-w-0">
        <span className={`block text-base font-bold leading-tight ${titleClassName}`}>
          {title}
        </span>
        <span className="block text-xs font-medium text-slate-300">{subtitle}</span>
      </span>
    </div>
  );
}
