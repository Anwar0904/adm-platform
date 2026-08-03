"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Mail,
    Sparkles,
    CheckCircle2,
    Bell,
} from "lucide-react";

export default function NewsletterCTASection() {
    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500" />

                <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-[150px]" />

                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-[150px]" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,.25)]">

                    <div className="grid items-center gap-16 p-8 lg:grid-cols-2 lg:p-20">

                        {/* Left */}

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white">
                                <Sparkles size={15} />
                                Weekly ADM Digest
                            </span>

                            <h2 className="mt-8 text-4xl font-black leading-tight text-white lg:text-6xl">
                                Stay Ahead of
                                <span className="block">
                                    Technology.
                                </span>
                            </h2>

                            <p className="mt-8 text-lg leading-9 text-blue-100">
                                Join thousands of developers, founders and
                                business leaders receiving carefully curated AI,
                                software engineering and digital transformation
                                insights every week.
                            </p>

                            <div className="mt-10 grid gap-5 sm:grid-cols-2">

                                <div className="flex items-center gap-3 text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={22}
                                    />
                                    No Spam Ever
                                </div>

                                <div className="flex items-center gap-3 text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={22}
                                    />
                                    Weekly Insights
                                </div>

                                <div className="flex items-center gap-3 text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={22}
                                    />
                                    Exclusive Guides
                                </div>

                                <div className="flex items-center gap-3 text-white">
                                    <CheckCircle2
                                        className="text-cyan-300"
                                        size={22}
                                    />
                                    Unsubscribe Anytime
                                </div>

                            </div>
                        </motion.div>

                        {/* Right */}

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="rounded-[32px] bg-white p-8 shadow-2xl lg:p-10">

                                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100">
                                    <Mail
                                        size={36}
                                        className="text-blue-600"
                                    />
                                </div>

                                <h3 className="text-3xl font-black text-slate-900">
                                    Subscribe Free
                                </h3>

                                <p className="mt-4 leading-8 text-slate-600">
                                    Get the latest articles directly in your inbox.
                                </p>

                                <form className="mt-10 space-y-5">

                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                                    />

                                    <button
                                        type="submit"
                                        className="group flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Subscribe Now

                                        <ArrowRight
                                            size={18}
                                            className="ml-2 transition group-hover:translate-x-1"
                                        />
                                    </button>

                                </form>

                                <div className="mt-8 flex items-center gap-3 rounded-2xl bg-slate-100 p-4">

                                    <Bell
                                        size={22}
                                        className="text-blue-600"
                                    />

                                    <p className="text-sm text-slate-600">
                                        12,000+ professionals already subscribed.
                                    </p>

                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}