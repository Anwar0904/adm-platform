import {
  Search,
  PenTool,
  Code2,
  Rocket,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description:
      "I clarify the problem, users, constraints, and definition of done before writing a single line of code.",
  },
  {
    icon: PenTool,
    title: "Design",
    description:
      "I shape an interface and interaction model that keeps the real user need in view.",
  },
  {
    icon: Code2,
    title: "Develop",
    description:
      "I build the product across frontend, backend, data, and integrations with a focus on clarity.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description:
      "I take the product to production with deliberate deployment, monitoring, and performance checks.",
  },
  {
    icon: TrendingUp,
    title: "Scale",
    description:
      "I use feedback and evidence to improve the product after launch.",
  },
];

export default function ProcessSection() {
  return (
    <section className="section-shell">
      <div className="section-content">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <span className="section-kicker">
            How I work
          </span>

          <h2 className="section-title">
            From first conversation to shipped product
          </h2>

          <p className="section-copy">
            Every successful digital product follows a structured process.
            A practical process keeps the work understandable, testable, and moving.
          </p>
        </div>

        {/* Process */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-slate-200 lg:block" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6 xl:gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="group relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:hover:translate-y-0 lg:hover:shadow-none"
                >
                  {/* Icon */}
                  <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>

                  <div className="mb-2 text-xs font-bold tracking-wider text-blue-600 sm:text-sm">
                    STEP {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}