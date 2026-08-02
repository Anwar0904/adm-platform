// src/components/public/services/hero-section.tsx

"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  "AI-Powered Solutions",
  "Enterprise Software",
  "Cloud Native",
  "Modern UX/UI",
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support" },
];

export default function ServicesHeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-0 top-20 h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 pt-28 pb-20 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              Professional Digital Solutions
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build Digital Products
              <span className="block bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                That Scale With Your Business
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              ADM designs and develops high-performance digital products,
              enterprise platforms, AI-powered solutions, and modern web
              applications that help businesses grow faster.
            </p>

            {/* Highlights */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 backdrop-blur"
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-blue-700"
              >
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-800 transition-all duration-300 hover:border-blue-600 hover:text-blue-600"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[32px] border border-white/30 bg-white/70 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
                alt="ADM Services"
                className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[580px]"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute -left-4 top-8 rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur md:left-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                AI Ready
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                Enterprise Solutions
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Secure • Scalable • Reliable
              </p>
            </div>

            {/* Stats */}
            <div className="absolute -bottom-6 left-1/2 flex w-[95%] -translate-x-1/2 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-2xl backdrop-blur">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex-1 text-center ${
                    index !== stats.length - 1
                      ? "border-r border-slate-200"
                      : ""
                  }`}
                >
                  <h4 className="text-2xl font-black text-blue-600">
                    {item.value}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}