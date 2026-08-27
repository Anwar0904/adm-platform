import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_#dbeafe_0%,_#ffffff_42%,_#f8fafc_100%)]" />

      <div className="absolute -left-32 -top-32 -z-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] sm:h-96 sm:w-96" />

      <div className="absolute -bottom-32 -right-32 -z-10 h-80 w-80 rounded-full bg-sky-400/20 blur-[110px] sm:h-[500px] sm:w-[500px]" />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 md:gap-14 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24 xl:gap-20">
        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/90 px-3.5 py-2 text-xs font-bold text-blue-700 shadow-sm backdrop-blur sm:mb-6 sm:px-4 sm:text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
              <Sparkles
                size={11}
                strokeWidth={2.5}
              />
            </span>

            AI-First Digital Agency
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-[2.45rem] font-black leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl sm:leading-[1.06] md:text-6xl lg:text-[4rem] xl:text-[4.5rem]">
            Building{" "}
            <span className="text-blue-600">
              Intelligent Digital Experiences
            </span>{" "}
            for Tomorrow
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8">
            ADM helps businesses transform through AI,
            software engineering, automation, cloud solutions,
            branding, and enterprise digital experiences.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
            <Link
              href="/consultation"
              className="group inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 sm:w-auto sm:px-7"
            >
              Book Consultation

              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2.2}
              />
            </Link>

            <Link
              href="/portfolio"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white sm:w-auto sm:px-7"
            >
              View Portfolio
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="shrink-0 text-blue-600"
              />
              AI-powered solutions
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="shrink-0 text-blue-600"
              />
              Scalable technology
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="shrink-0 text-blue-600"
              />
              Business-focused delivery
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
          {/* Glow */}
          <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/15 blur-3xl sm:-inset-8 sm:rounded-[2.5rem]" />

          {/* Main image card */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-white/80 bg-slate-100 shadow-2xl shadow-slate-900/10 sm:rounded-[2rem] lg:aspect-[5/4]">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5vblLpCKcR3_xl62UyN0Bjc4bIFFzHOkdpBvzcyPFw&s=10"
              alt="ADM digital technology dashboard"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
              className="object-cover object-center transition duration-700 hover:scale-[1.03]"
              priority
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/15 via-transparent to-blue-500/10" />
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-5 left-3 right-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:-bottom-6 sm:left-auto sm:right-5 sm:w-[260px] sm:p-5 lg:right-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sparkles
                  size={19}
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">
                  Intelligent by design
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Technology built around your
                  business goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}