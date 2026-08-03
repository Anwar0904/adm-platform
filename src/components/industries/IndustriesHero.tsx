"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    Sparkles,
    ShieldCheck,
    BrainCircuit,
} from "lucide-react";

export default function IndustriesHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-32 pb-24">
            {/* Background */}

            <div className="absolute inset-0">
                <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl" />
            </div>

            <div className="container relative mx-auto px-4 lg:px-8">
                <div className="grid items-center gap-20 lg:grid-cols-2">

                    {/* Left */}

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: .7 }}
                    >
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2 shadow-sm">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">
                                Industry-Focused Digital Transformation
                            </span>
                        </div>

                        <h1 className="max-w-3xl text-5xl font-black leading-tight text-slate-900 md:text-6xl">
                            Solutions Built
                            <span className="block text-blue-600">
                                For Your Industry.
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
                            Every industry has unique challenges.
                            ADM combines AI, software engineering,
                            cloud technologies, automation and modern UX
                            to create solutions tailored specifically for your
                            business sector.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-5">

                            <Link
                                href="/book-consultation"
                                className="group inline-flex items-center rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
                            >
                                Book Consultation

                                <ArrowRight className="ml-3 h-5 w-5 transition group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/portfolio"
                                className="inline-flex items-center rounded-2xl border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
                            >
                                View Case Studies
                            </Link>

                        </div>

                        <div className="mt-14 grid grid-cols-3 gap-6">

                            <div>
                                <h3 className="text-3xl font-black text-blue-600">15+</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Industries
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-blue-600">50+</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Projects
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-blue-600">98%</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Satisfaction
                                </p>
                            </div>

                        </div>
                    </motion.div>

                    {/* Right */}

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: .7 }}
                        className="relative"
                    >

                        <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl">

                            <Image
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
                                alt="Industries"
                                width={900}
                                height={700}
                                className="h-[600px] w-full object-cover"
                            />

                        </div>

                        {/* Floating Card */}

                        <motion.div
                            animate={{
                                y: [0, -12, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                            }}
                            className="absolute -left-8 top-10 hidden w-64 rounded-3xl border border-white/30 bg-white/90 p-6 shadow-xl backdrop-blur-xl lg:block"
                        >
                            <BrainCircuit className="mb-4 h-10 w-10 text-blue-600" />

                            <h3 className="font-bold text-slate-900">
                                AI-Driven Solutions
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Smart automation and intelligent workflows
                                customized for each business domain.
                            </p>
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 10, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 5,
                            }}
                            className="absolute -bottom-8 right-0 hidden w-72 rounded-3xl border border-white/30 bg-white/90 p-6 shadow-xl backdrop-blur-xl lg:block"
                        >
                            <div className="flex items-center gap-4">

                                <div className="rounded-2xl bg-blue-100 p-3">
                                    <Building2 className="h-7 w-7 text-blue-600" />
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-900">
                                        Enterprise Ready
                                    </h4>

                                    <p className="text-sm text-slate-500">
                                        Secure • Scalable • Future-proof
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">

                                <ShieldCheck className="h-8 w-8 text-emerald-500" />

                                <div>
                                    <h5 className="font-semibold">
                                        Trusted Delivery
                                    </h5>

                                    <p className="text-sm text-slate-500">
                                        Enterprise-grade architecture
                                    </p>
                                </div>

                            </div>

                        </motion.div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}