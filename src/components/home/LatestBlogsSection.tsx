"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string | { _id?: string; url?: string };
  category?: string | { name?: string; title?: string };
  publishedAt?: string;
  createdAt?: string;
};

function getImageUrl(
  image: Blog["featuredImage"]
): string {
  if (!image) {
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80";
  }

  if (typeof image === "string") {
    return image;
  }

  return (
    image.url ??
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80"
  );
}

function getCategory(
  category: Blog["category"]
): string {
  if (!category) return "Insights";

  if (typeof category === "string") {
    return category;
  }

  return category.name ?? category.title ?? "Insights";
}

function formatDate(date?: string) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function LatestBlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadBlogs() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/public/blogs?page=1&limit=3",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message ?? "Unable to load latest blogs."
          );
        }

        /*
         * Supports both:
         * data: [...]
         * data: { blogs: [...] }
         * data: { posts: [...] }
         */
        const data = result?.data;

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
            ? data.blogs
            : Array.isArray(data?.posts)
              ? data.posts
              : Array.isArray(data?.items)
                ? data.items
                : [];

        if (mounted) {
          setBlogs(items.slice(0, 3));
        }
      } catch (cause) {
        if (mounted) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load latest blogs."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="flex justify-center py-20 sm:py-24 lg:py-32">
      <div className="container px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 sm:px-5 sm:text-sm">
              Latest Insights
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:mt-6 sm:text-4xl md:text-5xl">
              Insights & Resources
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              Stay updated with technology trends, AI innovations,
              software engineering and digital transformation.
            </p>
          </div>

          <Link
            href="/blogs"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-semibold transition hover:bg-white hover:shadow-lg sm:w-fit sm:px-7 sm:py-4 sm:text-base"
          >
            View All Articles
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              Loading latest articles...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              No articles available yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Check back soon for the latest insights from ADM.
            </p>
          </div>
        )}

        {/* Blog cards */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {blogs.map((blog) => {
              const image = getImageUrl(blog.featuredImage);
              const category = getCategory(blog.category);
              const date = formatDate(
                blog.publishedAt ?? blog.createdAt
              );

              return (
                <article
                  key={blog._id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image */}
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="block"
                  >
                    <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                      <Image
                        src={image}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex flex-1 flex-col space-y-5 p-6 sm:p-8">

                    {/* Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 sm:px-4 sm:text-sm">
                        {category}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        {date}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="text-xl font-bold leading-snug text-slate-900 transition group-hover:text-blue-600 sm:text-2xl">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="line-clamp-3 text-sm leading-7 text-muted-foreground sm:text-base">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Read more */}
                    <div className="mt-auto pt-2">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-4 sm:text-base"
                      >
                        Read Article
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}