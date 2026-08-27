import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(14,165,233,0.12),transparent_32%),linear-gradient(to_bottom,#ffffff,#f8fafc)]" />

      {/* Soft glows */}
      <div className="absolute -left-40 -top-40 -z-20 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="absolute -bottom-40 -right-40 -z-20 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-[130px]" />

      {/* Technical grid */}
      <div className="absolute inset-0 -z-20 opacity-[0.035]">
        <div
          className="
            h-full
            w-full
            bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]
            bg-[size:48px_48px]
          "
        />
      </div>

      {/* Decorative orb */}
      <div className="absolute left-[48%] top-24 -z-10 hidden h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_30px_8px_rgba(59,130,246,0.35)] lg:block" />

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-[80%] items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 md:gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24 xl:gap-20">
        {/* =======================================================
            LEFT CONTENT
        ======================================================== */}

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-2 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-xl sm:px-4 sm:text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
              <Sparkles
                size={12}
                strokeWidth={2.5}
              />
            </span>

            AI-First Digital Agency

            <ChevronRight
              size={14}
              className="text-blue-400"
            />
          </div>

          {/* Heading */}

          <h1 className="max-w-4xl text-[2.7rem] font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.7rem]">
            We Build
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Intelligent
            </span>
            Digital Experiences.
          </h1>

          {/* Description */}

          <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            ADM combines artificial intelligence, software engineering,
            automation, and modern design to build digital products that
            help ambitious businesses move faster.
          </p>

          {/* CTA */}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/consultation"
              className="
                group
                inline-flex
                min-h-13
                w-full
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                px-7
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-xl
                shadow-blue-600/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-blue-700
                hover:shadow-2xl
                hover:shadow-blue-600/30
                sm:w-auto
              "
            >
              Start a Project

              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </Link>

            <Link
              href="/portfolio"
              className="
                inline-flex
                min-h-13
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white/80
                px-7
                py-3.5
                text-sm
                font-bold
                text-slate-800
                shadow-sm
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-slate-300
                hover:bg-white
                hover:shadow-lg
                sm:w-auto
              "
            >
              Explore Our Work
            </Link>
          </div>

          {/* Trust points */}

          <div className="mt-8 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="shrink-0 text-blue-600"
              />

              AI-powered solutions
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="shrink-0 text-blue-600"
              />

              Scalable architecture
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="shrink-0 text-blue-600"
              />

              Modern user experiences
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={17}
                className="shrink-0 text-blue-600"
              />

              Business-focused delivery
            </div>
          </div>

          {/* Mini credibility row */}

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-slate-200 pt-7">
            <div>
              <p className="text-2xl font-black text-slate-900">
                50+
              </p>

              <p className="text-xs font-medium text-slate-500">
                Projects delivered
              </p>
            </div>

            <div className="h-9 w-px bg-slate-200" />

            <div>
              <p className="text-2xl font-black text-slate-900">
                98%
              </p>

              <p className="text-xs font-medium text-slate-500">
                Client satisfaction
              </p>
            </div>

            <div className="h-9 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Globe2 size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Global
                </p>

                <p className="text-xs text-slate-500">
                  Digital delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            RIGHT VISUAL
        ======================================================== */}

        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          {/* Main glow */}

          <div className="absolute -inset-8 rounded-[3rem] bg-blue-500/10 blur-3xl" />

          {/* Decorative ring */}

          <div className="absolute -right-10 -top-10 hidden h-28 w-28 rounded-full border border-blue-200/60 lg:block" />

          <div className="absolute -bottom-12 -left-10 hidden h-32 w-32 rounded-full border border-cyan-200/60 lg:block" />

          {/* Main image */}

          <div
            className="
              relative
              aspect-[4/3]
              w-full
              overflow-hidden
              rounded-[1.75rem]
              border
              border-white
              bg-slate-100
              shadow-[0_30px_80px_rgba(15,23,42,0.16)]
              sm:rounded-[2.25rem]
              lg:aspect-[5/4]
            "
          >
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5vblLpCKcR3_xl62UyN0Bjc4bIFFzHOkdpBvzcyPFw&s=10"
              alt="ADM intelligent digital technology dashboard"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw"
              className="object-cover object-center transition duration-700 hover:scale-[1.04]"
              priority
            />

            {/* Image tint */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 via-transparent to-slate-950/20" />

            {/* Top status bar */}

            <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                Systems Online
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl">
                <Sparkles size={16} />
              </div>
            </div>
          </div>

          {/* =====================================================
              FLOATING AI CARD
          ====================================================== */}

          <div
            className="
              absolute
              -bottom-6
              left-3
              right-3
              rounded-2xl
              border
              border-white
              bg-white/95
              p-4
              shadow-2xl
              backdrop-blur-xl
              sm:-bottom-7
              sm:left-auto
              sm:right-6
              sm:w-[280px]
              sm:p-5
            "
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Zap
                  size={20}
                  fill="currentColor"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-900">
                    AI-powered delivery
                  </p>

                  <span className="text-xs font-bold text-emerald-600">
                    +24%
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Smarter workflows. Faster execution. Better digital
                  products.
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[82%] rounded-full bg-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              SMALL FLOATING METRIC
          ====================================================== */}

          <div className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur-xl xl:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Delivery
                </p>

                <p className="text-sm font-black text-slate-900">
                  Production Ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50/70 to-transparent" />
    </section>
  );
}