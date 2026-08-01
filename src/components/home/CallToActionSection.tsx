import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="relative overflow-hidden py-32 flex justify-center">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500" />

      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px]" />

      {/* Grid */}

      <div className="absolute inset-0 opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container relative z-10">

        <div className="mx-auto max-w-5xl text-center">

          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            🚀 Let's Build Something Extraordinary
          </span>

          <h2 className="mt-8 text-5xl font-black leading-tight text-white lg:text-7xl">
            Ready To Transform
            <br />
            Your Business?
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">
            Whether you're launching a startup, modernizing an enterprise,
            or integrating Artificial Intelligence into your business,
            ADM is ready to turn your vision into reality.
          </p>

          {/* Stats */}

          <div className="mt-16 grid grid-cols-2 gap-8 rounded-3xl border border-white/10 bg-white/10 p-10 backdrop-blur-xl lg:grid-cols-4">

            <div>
              <h3 className="text-4xl font-black text-white">
                50+
              </h3>
              <p className="mt-2 text-blue-100">
                Projects
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-white">
                98%
              </h3>
              <p className="mt-2 text-blue-100">
                Client Satisfaction
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-white">
                24/7
              </h3>
              <p className="mt-2 text-blue-100">
                Support
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-white">
                AI
              </h3>
              <p className="mt-2 text-blue-100">
                Powered
              </p>
            </div>

          </div>

          {/* Buttons */}

          <div className="mt-16 flex flex-col justify-center gap-5 sm:flex-row">

            <Link
              href="/consultation"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <CalendarDays className="h-6 w-6" />

              Book Free Consultation

              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-10 py-5 text-lg font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20"
            >
              Contact Our Team
            </Link>

          </div>

          {/* Bottom */}

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-blue-100">

            <span>✓ Free Discovery Call</span>

            <span>✓ No Hidden Charges</span>

            <span>✓ AI-First Solutions</span>

            <span>✓ Dedicated Support</span>

          </div>

        </div>

      </div>

    </section>
  );
}