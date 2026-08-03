"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Users,
    Award,
    Rocket,
    ArrowUpRight,
} from "lucide-react";

const metrics = [
    {
        value: "98%",
        label: "Client Satisfaction",
        description: "Long-term partnerships built on trust and consistent delivery.",
        icon: Users,
        color: "from-blue-600 to-cyan-500",
    },
    {
        value: "250%",
        label: "Average ROI",
        description: "Digital products that generate measurable business growth.",
        icon: TrendingUp,
        color: "from-emerald-500 to-green-600",
    },
    {
        value: "60+",
        label: "Projects Delivered",
        description: "Successfully completed across multiple industries.",
        icon: Rocket,
        color: "from-violet-500 to-indigo-600",
    },
    {
        value: "12+",
        label: "Industry Awards",
        description: "Recognition for innovation, quality and digital excellence.",
        icon: Award,
        color: "from-amber-500 to-orange-600",
    },
];

const achievements = [
    {
        title: "Reduced Operational Cost",
        value: "45%",
        subtitle: "AI Automation Platform",
    },
    {
        title: "Revenue Growth",
        value: "3.7x",
        subtitle: "E-Commerce Transformation",
    },
    {
        title: "Processing Speed",
        value: "6x",
        subtitle: "Enterprise Workflow",
    },
    {
        title: "Customer Engagement",
        value: "185%",
        subtitle: "Digital Experience Platform",
    },
];

export default function ClientSuccessMetrics() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-24">
            <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

            <div className="container relative mx-auto px-4 lg:px-8">
                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        Success by Numbers
                    </span>

                    <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
                        Every Project is Built
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            To Produce Business Results
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Beautiful interfaces are only the beginning. Every solution we
                        deliver is measured by performance, efficiency, growth and long-term
                        impact.
                    </p>
                </motion.div>

                {/* Top Metrics */}

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                viewport={{ once: true }}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.25 },
                                }}
                                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:border-blue-200 hover:shadow-2xl"
                            >
                                <div
                                    className={`inline-flex rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-lg`}
                                >
                                    <Icon size={28} />
                                </div>

                                <h3 className="mt-8 text-5xl font-black text-slate-900">
                                    {item.value}
                                </h3>

                                <h4 className="mt-3 text-xl font-bold text-slate-900">
                                    {item.label}
                                </h4>

                                <p className="mt-4 leading-7 text-slate-600">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Success Dashboard */}

                <motion.div
                    initial={{ opacity: 0, y: 45 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl"
                >
                    <div className="grid lg:grid-cols-2">
                        {/* Left */}

                        <div className="p-8 md:p-12 lg:p-14">
                            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                                Business Outcomes
                            </span>

                            <h3 className="mt-5 text-4xl font-black text-slate-900">
                                We Build Products
                                <br />
                                That Move Businesses Forward.
                            </h3>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                Every ADM project is designed around measurable KPIs instead of
                                assumptions. We optimize user experience, performance,
                                scalability and business value simultaneously.
                            </p>

                            <div className="mt-10 space-y-5">
                                {[
                                    "Performance-first architecture",
                                    "AI-driven automation",
                                    "Scalable cloud infrastructure",
                                    "Enterprise-grade security",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
                                    >
                                        <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                            <ArrowUpRight size={18} />
                                        </div>

                                        <span className="font-semibold text-slate-700">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}

                        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8 md:p-12 lg:p-14 text-white">
                            <div className="grid gap-5 sm:grid-cols-2">
                                {achievements.map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
                                    >
                                        <p className="text-5xl font-black">{item.value}</p>

                                        <h4 className="mt-5 text-lg font-bold">
                                            {item.title}
                                        </h4>

                                        <p className="mt-2 text-sm text-blue-100">
                                            {item.subtitle}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-10 rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-xl">
                                <p className="text-sm uppercase tracking-[0.2em] text-blue-100">
                                    ADM Promise
                                </p>

                                <h4 className="mt-4 text-3xl font-black leading-tight">
                                    We measure our success
                                    <br />
                                    by your business growth.
                                </h4>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

    )
}