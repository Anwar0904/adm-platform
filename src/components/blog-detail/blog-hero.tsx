"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    CalendarDays,
    Clock3,
    Eye,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blog: BlogPost;
}

export default function BlogHero({
    blog,
}: Props) {
    return (
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
            {/* Background */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.06),transparent_40%)]" />

            <div className="container relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
                {/* Breadcrumb */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-10 flex flex-wrap items-center gap-2 text-sm text-slate-500"
                >
                    <Link
                        href="/"
                        className="transition hover:text-blue-600"
                    >
                        Home
                    </Link>

                    <ChevronRight
                        size={16}
                    />

                    <Link
                        href="/blogs"
                        className="transition hover:text-blue-600"
                    >
                        Blogs
                    </Link>

                    <ChevronRight
                        size={16}
                    />

                    <span className="font-medium text-slate-900">
                        {blog.title}
                    </span>
                </motion.div>

                <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
                    {/* Content */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 35,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: .6,
                        }}
                    >
                        <Link
                            href="/blogs"
                            className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-600 hover:text-blue-600"
                        >
                            <ArrowLeft
                                size={16}
                            />

                            Back to Blogs
                        </Link>

                        <div className="mb-6 inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                            {blog.category}
                        </div>

                        <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
                            {blog.title}
                        </h1>

                        <p className="mt-8 max-w-3xl text-lg leading-9 text-slate-600 lg:text-xl">
                            {blog.excerpt}
                        </p>

                        {/* Meta */}

                        <div className="mt-10 flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-4">
                                <Image
                                    src={
                                        blog.author
                                            .avatar
                                    }
                                    alt={
                                        blog.author
                                            .name
                                    }
                                    width={
                                        56
                                    }
                                    height={
                                        56
                                    }
                                    className="h-14 w-14 rounded-full object-cover"
                                />

                                <div>
                                    <p className="font-bold text-slate-900">
                                        {
                                            blog
                                                .author
                                                .name
                                        }
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {
                                            blog
                                                .author
                                                .role
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="hidden h-12 w-px bg-slate-200 lg:block" />

                            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CalendarDays
                                        size={
                                            17
                                        }
                                    />

                                    {new Date(
                                        blog.publishedAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock3
                                        size={
                                            17
                                        }
                                    />

                                    {
                                        blog.readingTime
                                    }{" "}
                                    min read
                                </div>

                                <div className="flex items-center gap-2">
                                    <Eye
                                        size={
                                            17
                                        }
                                    />

                                    {blog.views.toLocaleString()}{" "}
                                    views
                                </div>
                            </div>
                        </div>

                        {/* Tags */}

                        <div className="mt-10 flex flex-wrap gap-3">
                            {blog.tags.map(
                                (
                                    tag
                                ) => (
                                    <span
                                        key={
                                            tag
                                        }
                                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        #
                                        {
                                            tag
                                        }
                                    </span>
                                )
                            )}
                        </div>
                    </motion.div>

                    {/* Featured Image */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: .96,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: .7,
                        }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-blue-500/15 to-cyan-400/15 blur-3xl" />

                        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
                            <Image
                                src={
                                    blog.featuredImage
                                }
                                alt={
                                    blog.title
                                }
                                width={
                                    900
                                }
                                height={
                                    700
                                }
                                priority
                                className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}