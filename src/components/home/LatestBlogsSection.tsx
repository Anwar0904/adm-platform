import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "How Artificial Intelligence is Transforming Modern Businesses",
    slug: "artificial-intelligence-business",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    category: "Artificial Intelligence",
    date: "Jan 12, 2026",
    excerpt:
      "Discover how organizations are leveraging AI to automate workflows and increase productivity.",
  },
  {
    id: 2,
    title: "Building High Performance Web Applications in 2026",
    slug: "high-performance-web-apps",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    category: "Development",
    date: "Jan 05, 2026",
    excerpt:
      "Performance-first development techniques that every modern company should adopt.",
  },
  {
    id: 3,
    title: "Future of Enterprise Software and Digital Transformation",
    slug: "future-enterprise-software",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    category: "Enterprise",
    date: "Dec 28, 2025",
    excerpt:
      "Enterprise technology is evolving rapidly. Learn the trends shaping tomorrow's organizations.",
  },
];

export default function LatestBlogsSection() {
  return (
    <section className="py-32 flex justify-center">

      <div className="container">

        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
              Latest Insights
            </span>

            <h2 className="mt-6 text-5xl font-black">
              Insights & Resources
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Stay updated with technology trends, AI innovations,
              software engineering and digital transformation.
            </p>

          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-xl border px-7 py-4 font-semibold transition hover:bg-white hover:shadow-lg"
          >
            View All Articles

            <ArrowRight className="h-5 w-5" />

          </Link>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {blogs.map((blog) => (

            <article
              key={blog.id}
              className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >

              <Link href={`/blogs/${blog.slug}`}>

                <div className="relative h-72 overflow-hidden">

                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                </div>

              </Link>

              <div className="space-y-5 p-8">

                <div className="flex items-center justify-between">

                  <span className="rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-600">
                    {blog.category}
                  </span>

                  <span className="flex items-center gap-2 text-sm text-muted-foreground">

                    <CalendarDays className="h-4 w-4" />

                    {blog.date}

                  </span>

                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                >
                  <h3 className="text-2xl font-bold transition group-hover:text-blue-600">
                    {blog.title}
                  </h3>
                </Link>

                <p className="leading-8 text-muted-foreground">
                  {blog.excerpt}
                </p>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-all group-hover:gap-4"
                >
                  Read Article

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