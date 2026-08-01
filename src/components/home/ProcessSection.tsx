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
      "We deeply understand your business, goals, users, and challenges before writing a single line of code.",
  },
  {
    icon: PenTool,
    title: "Design",
    description:
      "Beautiful UI/UX prototypes with modern interaction design focused on user experience.",
  },
  {
    icon: Code2,
    title: "Develop",
    description:
      "Robust full-stack development using AI-assisted engineering and scalable architecture.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description:
      "Production-ready deployment with CI/CD, cloud infrastructure and monitoring.",
  },
  {
    icon: TrendingUp,
    title: "Scale",
    description:
      "Continuous optimization, analytics and feature improvements for long-term growth.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-32 flex justify-center">

      <div className="container">

        <div className="mx-auto mb-20 max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            Our Process
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Our Execution Blueprint
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-600">
            Every successful digital product follows a structured process.
            Here's how ADM transforms ideas into intelligent solutions.
          </p>

        </div>

        <div className="relative">

          {/* Desktop Line */}

          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-slate-200 lg:block" />

          <div className="grid gap-10 lg:grid-cols-5">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group relative"
                >

                  <div className="relative z-10 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl transition duration-300 group-hover:scale-110">

                    <Icon className="h-7 w-7" />

                  </div>

                  <div className="mb-3 text-sm font-bold text-blue-600">
                    STEP {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="mb-4 text-2xl font-bold">
                    {step.title}
                  </h3>

                  <p className="leading-7 text-muted-foreground">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </section>
  );
}