"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    BookOpen,
    Mail,
} from "lucide-react";

export default function BlogFinalCTASection() {
    return (
        <section className="relative overflow-hidden py-28 lg:py-36">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" />

                <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[180px]" />

                <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[180px]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:30px_30px] opacity-20" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 50,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-white/10 p-10 backdrop-blur-2xl shadow-[0_50px_120px_rgba(0,0,0,.35)] lg:p-20"
                >
                    {/* Badge */}

                    <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-blue-200">
                            <Sparkles size={16} />
                            Keep Learning With ADM
                        </span>
                    </div>

                    {/* Heading */}

                    <h2 className="mx-auto mt-8 max-w-5xl text-center text-5xl font-black leading-tight text-white lg:text-7xl">
                        Turn Knowledge Into
                        <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                            Real Innovation.
                        </span>
                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-center text-xl leading-10 text-slate-300">
                        Discover expert insights, practical tutorials,
                        engineering guides and AI innovations that help you
                        build better products and grow your business faster.
                    </p>

                    {/* Features */}

                    <div className="mt-16 grid gap-6 md:grid-cols-3">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                            <BookOpen
                                className="mx-auto mb-5 text-cyan-300"
                                size={36}
                            />

                            <h3 className="text-xl font-bold text-white">
                                300+ Articles
                            </h3>

                            <p className="mt-3 text-slate-300">
                                Practical guides written by industry experts.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                            <Sparkles
                                className="mx-auto mb-5 text-cyan-300"
                                size={36}
                            />

                            <h3 className="text-xl font-bold text-white">
                                Weekly Insights
                            </h3>

                            <p className="mt-3 text-slate-300">
                                Fresh AI, Cloud and Software Engineering content.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                            <Mail
                                className="mx-auto mb-5 text-cyan-300"
                                size={36}
                            />

                            <h3 className="text-xl font-bold text-white">
                                Free Newsletter
                            </h3>

                            <p className="mt-3 text-slate-300">
                                Receive the latest articles directly in your inbox.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}

                    <div className="mt-16 flex flex-col justify-center gap-5 sm:flex-row">
                        <Link
                            href="/contact"
                            className="group inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-lg font-bold text-blue-700 transition-all hover:-translate-y-1 hover:shadow-2xl"
                        >
                            Work With ADM

                            <ArrowRight
                                size={20}
                                className="ml-3 transition group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-10 py-5 text-lg font-semibold text-white backdrop-blur transition hover:bg-white/20"
                        >
                            Explore More Articles
                        </Link>
                    </div>

                    {/* Bottom */}

                    <div className="mt-14 border-t border-white/10 pt-10 text-center">
                        <p className="text-slate-400">
                            Trusted by developers, founders and technology
                            leaders worldwide.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
