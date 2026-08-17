"use client";

import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import {
    ArrowRight,
    CalendarDays,
    Clock3,
} from "lucide-react";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blogs: BlogPost[];
}

export default function RelatedArticles({
    blogs,
}: Props) {
    return (
        <section className="bg-slate-50 py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mb-14">
                    <p className="font-semibold uppercase tracking-[0.3em] text-blue-600">
                        Continue Reading
                    </p>

                    <h2 className="mt-4 text-4xl font-black text-slate-900">
                        Related Articles
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {blogs.map(
                        (
                            blog,
                            index
                        ) => (
                            <motion.article
                                key={
                                    blog.id
                                }
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay:
                                        index *
                                        .1,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={
                                            blog.featuredImage
                                        }
                                        alt={
                                            blog.title
                                        }
                                        fill
                                        className="object-cover transition duration-700 group-hover:scale-110"
                                    />
                                </div>

                                <div className="p-7">
                                    <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                                        {
                                            blog.category
                                        }
                                    </span>

                                    <h3 className="mt-5 text-2xl font-black leading-tight text-slate-900">
                                        {
                                            blog.title
                                        }
                                    </h3>

                                    <p className="mt-4 line-clamp-3 text-slate-600">
                                        {
                                            blog.excerpt
                                        }
                                    </p>

                                    <div className="mt-6 flex items-center gap-5 text-sm text-slate-500">
                                        <span className="flex items-center gap-2">
                                            <CalendarDays size={16} />
                                            {
                                                blog.publishedAt
                                            }
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <Clock3 size={16} />
                                            {
                                                blog.readingTime
                                            }{" "}
                                            min
                                        </span>
                                    </div>

                                    <Link
                                        href={`/blogs/${blog.slug}`}
                                        className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600"
                                    >
                                        Read Article

                                        <ArrowRight
                                            size={
                                                18
                                            }
                                        />
                                    </Link>
                                </div>
                            </motion.article>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}