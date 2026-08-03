"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "AI-first Architecture",
  "Enterprise Grade Security",
  "Scalable Infrastructure",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-blue-50 dark:to-slate-950">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-sky-400/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-24 lg:px-8 lg:py-32">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary">
            Home
          </Link>

          <span>/</span>

          <Link href="/services" className="hover:text-primary">
            Services
          </Link>

          <span>/</span>

          <span className="font-medium text-foreground">
            AI Automation
          </span>
        </motion.div>

        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .6 }}
          >

            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Enterprise AI Solution
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              AI Automation
              <br />
              <span className="text-primary">
                That Works For You
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              Transform repetitive workflows into intelligent,
              automated systems using custom AI agents,
              LLM integrations, workflow orchestration,
              and enterprise automation pipelines.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/book-consultation"
                className="inline-flex items-center rounded-xl bg-primary px-7 py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                Book Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/portfolio"
                className="inline-flex items-center rounded-xl border px-7 py-4 font-semibold hover:bg-muted"
              >
                View Case Studies
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {item}
                </div>
              ))}
            </div>

          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .6 }}
            className="relative"
          >

            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-primary/20 via-sky-300/20 to-transparent blur-3xl" />

            <div className="relative overflow-hidden rounded-[32px] border bg-card shadow-2xl">

              <Image
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
                alt="AI Automation"
                width={1200}
                height={900}
                className="aspect-[4/3] h-full w-full object-cover"
              />

            </div>

            {/* Floating cards */}

            <motion.div
              animate={{
                y: [-8, 8, -8],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute -left-6 top-8 hidden rounded-2xl border bg-background p-5 shadow-xl lg:block"
            >
              <p className="text-sm text-muted-foreground">
                Productivity
              </p>

              <h3 className="mt-2 text-3xl font-black text-primary">
                +82%
              </h3>
            </motion.div>

            <motion.div
              animate={{
                y: [8, -8, 8],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
              className="absolute -bottom-6 -right-6 hidden rounded-2xl border bg-background p-5 shadow-xl lg:block"
            >
              <p className="text-sm text-muted-foreground">
                Time Saved
              </p>

              <h3 className="mt-2 text-3xl font-black">
                1200+
              </h3>

              <span className="text-primary font-semibold">
                Hours / Month
              </span>
            </motion.div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}