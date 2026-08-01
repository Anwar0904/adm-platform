import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const portfolio = [
  {
    title: "Healthcare AI Platform",
    category: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
  },
  {
    title: "Modern Banking Dashboard",
    category: "Web Application",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  },
  {
    title: "Smart Logistics System",
    category: "Enterprise Software",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
  },
];

export default function PortfolioSection() {
  return (
    <section className="bg-slate-50 py-32 flex justify-center">

      <div className="container">

        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

          <div>

            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
              Portfolio
            </span>

            <h2 className="mt-6 text-5xl font-black">
              Work That Creates Impact
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Every project represents our commitment to innovation,
              performance, and exceptional user experience.
            </p>

          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl border px-6 py-4 font-semibold transition hover:bg-white hover:shadow-lg"
          >
            View All Projects
            <ArrowRight className="h-5 w-5" />
          </Link>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {portfolio.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="relative h-72 overflow-hidden sm:h-80">

                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-6 left-6">

                  <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                    {project.category}
                  </span>

                </div>

              </div>

              <div className="space-y-5 p-8">

                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 font-semibold text-blue-600 transition group-hover:gap-4"
                >
                  Explore Project

                  <ArrowRight className="h-5 w-5" />

                </Link>

              </div>

            </article>
          ))}

        </div>

      </div>

    </section>
  );
}