import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="relative flex justify-center overflow-hidden py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500" />

      <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:50px_50px]" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <span className="inline-flex max-w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md sm:px-5 sm:text-sm">
            🚀 Let's Build Something Extraordinary
          </span>

          {/* Heading */}
          <h2 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl">
            Ready To Transform
            <br className="hidden sm:block" /> Your Business?
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-blue-100 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
            Whether you're launching a startup, modernizing an enterprise, or
            integrating Artificial Intelligence into your business, ADM is
            ready to turn your vision into reality.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl sm:mt-16 sm:grid-cols-4 sm:rounded-3xl">
            <Stat value="50+" label="Projects" />
            <Stat value="98%" label="Client Satisfaction" />
            <Stat value="24/7" label="Support" />
            <Stat value="AI" label="Powered" />
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:mt-16 sm:flex-row sm:gap-5">
            <Link
              href="/consultation"
              className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-bold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-auto sm:px-8 sm:py-5 sm:text-lg lg:px-10"
            >
              <CalendarDays className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />

              <span>Book Free Consultation</span>

              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1.5 sm:group-hover:translate-x-2" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20 sm:w-auto sm:px-8 sm:py-5 sm:text-lg lg:px-10"
            >
              Contact Our Team
            </Link>
          </div>

          {/* Bottom Benefits */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-blue-100 sm:mt-16 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
            <Benefit>Free Discovery Call</Benefit>
            <Benefit>No Hidden Charges</Benefit>
            <Benefit>AI-First Solutions</Benefit>
            <Benefit>Dedicated Support</Benefit>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="px-3 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
      <h3 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
        {value}
      </h3>

      <p className="mt-1 text-xs text-blue-100 sm:mt-2 sm:text-sm lg:text-base">
        {label}
      </p>
    </div>
  );
}

function Benefit({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true">✓</span>
      {children}
    </span>
  );
}