"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blog: BlogPost;
}

export default function ArticleLayout({
    blog,
}: Props) {
    const [progress, setProgress] =
        useState(0);

    useEffect(() => {
        const calculate = () => {
            const article =
                document.getElementById(
                    "article-content"
                );

            if (!article) return;

            const top =
                article.offsetTop;

            const height =
                article.offsetHeight;

            const scroll =
                window.scrollY;

            const viewport =
                window.innerHeight;

            const total =
                height - viewport;

            const current =
                scroll - top;

            const value =
                Math.min(
                    Math.max(
                        (current /
                            total) *
                        100,
                        0
                    ),
                    100
                );

            setProgress(value);
        };

        calculate();

        window.addEventListener(
            "scroll",
            calculate
        );

        return () =>
            window.removeEventListener(
                "scroll",
                calculate
            );
    }, []);

    const headings = useMemo(() => {
        return blog.tableOfContents;
    }, [blog]);

    return (
        <section className="bg-white py-16 lg:py-24">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[300px_minmax(0,1fr)]">
                    {/* Sidebar */}

                    <aside className="hidden lg:block">
                        <div className="sticky top-28 space-y-8">
                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Table of
                                    Contents
                                </h3>

                                <div className="mt-6 space-y-4">
                                    {headings.map(
                                        (
                                            item
                                        ) => (
                                            <a
                                                key={
                                                    item.id
                                                }
                                                href={`#${item.id}`}
                                                className="flex items-center gap-3 text-sm font-medium text-slate-600 transition hover:text-blue-600"
                                            >
                                                <CheckCircle2
                                                    size={
                                                        16
                                                    }
                                                    className="text-blue-500"
                                                />

                                                {
                                                    item.title
                                                }
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-600">
                                        Reading
                                        Progress
                                    </span>

                                    <span className="text-sm font-bold text-blue-600">
                                        {Math.round(
                                            progress
                                        )}
                                        %
                                    </span>
                                </div>

                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                                    <motion.div
                                        animate={{
                                            width: `${progress}%`,
                                        }}
                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Article */}

                    <article
                        id="article-content"
                        className="mx-auto max-w-4xl"
                    >
                        <div
                            className="
                            prose
                            prose-slate
                            prose-lg
                            lg:prose-xl
                            max-w-none

                            prose-headings:scroll-mt-32
                            prose-headings:font-black
                            prose-headings:text-slate-900

                            prose-p:leading-9

                            prose-img:rounded-3xl

                            prose-pre:rounded-2xl

                            prose-code:before:hidden
                            prose-code:after:hidden

                            prose-a:text-blue-600
                            prose-a:no-underline
                            hover:prose-a:text-blue-700

                            prose-blockquote:border-blue-500
                            prose-blockquote:text-slate-700
                        "
                        >
                            <ReactMarkdown
                                remarkPlugins={[
                                    remarkGfm,
                                ]}
                                components={{
                                    h1: ({
                                        children,
                                    }) => (
                                        <h1 id="introduction">
                                            {
                                                children
                                            }
                                        </h1>
                                    ),

                                    h2: ({
                                        children,
                                    }) => {
                                        const id =
                                            String(
                                                children
                                            )
                                                .toLowerCase()
                                                .replaceAll(
                                                    " ",
                                                    "-"
                                                );

                                        return (
                                            <h2
                                                id={
                                                    id
                                                }
                                            >
                                                {
                                                    children
                                                }
                                            </h2>
                                        );
                                    },
                                }}
                            >
                                {
                                    blog.content
                                }
                            </ReactMarkdown>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}