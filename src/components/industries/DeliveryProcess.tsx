"use client";

import { motion } from "framer-motion";
import {
    Search,
    PencilRuler,
    Code2,
    Rocket,
    BarChart3,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        id: "01",
        title: "Discovery",
        subtitle: "Business Analysis",
        icon: Search,
        description:
            "We understand your business, users, competitors and technical challenges before writing a single line of code.",
        deliverables: [
            "Requirements Workshop",
            "User Research",
            "Technical Planning",
        ],
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: "02",
        title: "Design",
        subtitle: "UX & Architecture",
        icon: PencilRuler,
        description:
            "Beautiful user experiences backed by scalable system architecture and modern design principles.",
        deliverables: [
            "UI/UX Design",
            "Wireframes",
            "System Architecture",
        ],
        color: "from-indigo-500 to-blue-500",
    },
    {
        id: "03",
        title: "Development",
        subtitle: "Engineering",
        icon: Code2,
        description:
            "High-performance development using modern frameworks, automation and AI-assisted engineering.",
        deliverables: [
            "Frontend",
            "Backend APIs",
            "AI Integration",
        ],
        color: "from-cyan-500 to-blue-600",
    },
    {
        id: "04",
        title: "Deployment",
        subtitle: "Launch",
        icon: Rocket,
        description:
            "Testing, CI/CD pipelines, cloud deployment and production monitoring for a seamless release.",
        deliverables: [
            "QA Testing",
            "Cloud Deployment",
            "Security Audit",
        ],
        color: "from-sky-500 to-blue-700",
    },
    {
        id: "05",
        title: "Growth",
        subtitle: "Continuous Improvement",
        icon: BarChart3,
        description:
            "Continuous optimization, analytics and feature evolution to help your business scale confidently.",
        deliverables: [
            "Analytics",
            "Optimization",
            "New Features",
        ],
        color: "from-blue-600 to-indigo-700",
    },
];

export default function DeliveryProcess() {
    return (
        <section className="relative overflow-hidden bg-slate-50 py-24">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb12,transparent_40%),radial-gradient(circle_at_bottom_right,#38bdf812,transparent_40%)]" />

            <div className="relative container mx-auto px-4 lg:px-8">

                <div className="mx-auto max-w-3xl text-center">

                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Our Process
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
                        Every Project Follows
                        <span className="block text-blue-600">
                            A Proven Delivery Framework
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Great software isn't built by accident.
                        Our structured delivery process minimizes risks while maximizing
                        quality, speed and business value.
                    </p>

                </div>

                {/* Timeline */}

                <div className="relative mt-20">

                    <div className="absolute left-7 top-0 hidden h-full w-1 bg-gradient-to-b from-blue-600 via-cyan-400 to-blue-700 lg:block" />

                    <div className="space-y-12">

                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                    className="group flex flex-col gap-8 lg:flex-row"
                                >

                                    {/* Number */}

                                    <div className="relative flex-shrink-0">

                                        <div
                                            className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} shadow-xl transition duration-500 group-hover:scale-110`}
                                        >
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>

                                    </div>

                                    {/* Card */}

                                    <div className="flex-1 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">

                                        <div className="flex flex-col justify-between gap-6 lg:flex-row">

                                            <div>

                                                <span className="text-sm font-bold tracking-widest text-blue-600">
                                                    STEP {step.id}
                                                </span>

                                                <h3 className="mt-3 text-3xl font-black text-slate-900">
                                                    {step.title}
                                                </h3>

                                                <p className="mt-2 font-semibold text-slate-500">
                                                    {step.subtitle}
                                                </p>

                                                <p className="mt-6 max-w-3xl leading-8 text-slate-600">
                                                    {step.description}
                                                </p>

                                            </div>

                                            <ArrowRight className="hidden h-8 w-8 text-blue-500 lg:block" />

                                        </div>

                                        <div className="mt-8 grid gap-4 sm:grid-cols-3">

                                            {step.deliverables.map((item) => (

                                                <div
                                                    key={item}
                                                    className="rounded-2xl bg-slate-100 px-5 py-4 text-center font-medium text-slate-700 transition hover:bg-blue-600 hover:text-white"
                                                >
                                                    {item}
                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                </motion.div>
                            );
                        })}

                    </div>

                </div>

                {/* Bottom Banner */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 rounded-[36px] bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 p-10 text-white shadow-2xl"
                >

                    <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">

                        <div>

                            <h3 className="text-4xl font-black">
                                Transparent Process.
                                <span className="block">
                                    Predictable Results.
                                </span>
                            </h3>

                            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
                                You'll always know what we're building,
                                why we're building it and what comes next.
                                No surprises—just continuous progress.
                            </p>

                        </div>

                        <div className="grid grid-cols-2 gap-8 text-center">

                            <div>

                                <h4 className="text-5xl font-black">
                                    100%
                                </h4>

                                <p className="mt-2 text-blue-100">
                                    Transparent
                                </p>

                            </div>

                            <div>

                                <h4 className="text-5xl font-black">
                                    Agile
                                </h4>

                                <p className="mt-2 text-blue-100">
                                    Delivery
                                </p>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}