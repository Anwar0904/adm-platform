"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import {
    FaGithub,
    FaLinkedinIn,
} from "react-icons/fa";

const leadership = [
    {
        id: 1,
        name: "Alex Morgan",
        role: "Founder & CEO",
        image:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80",
        short:
            "Visionary leader driving AI-powered digital transformation for modern businesses.",
        expertise: [
            "Business Strategy",
            "AI Innovation",
            "Digital Transformation",
        ],
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Chief Technology Officer",
        image:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80",
        short:
            "Architect of scalable software platforms and enterprise-grade cloud solutions.",
        expertise: [
            "System Architecture",
            "Cloud",
            "AI Engineering",
        ],
    },
    {
        id: 3,
        name: "Daniel Kim",
        role: "Creative Director",
        image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80",
        short:
            "Transforms complex ideas into intuitive digital experiences people love.",
        expertise: [
            "UI/UX",
            "Brand Design",
            "Product Design",
        ],
    },
];

export default function LeadershipSection() {
    return (
        <section className="relative overflow-hidden bg-white py-24">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb08,transparent_35%),radial-gradient(circle_at_bottom_left,#38bdf808,transparent_35%)]" />

            <div className="container relative mx-auto px-4 lg:px-8">

                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        Leadership
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
                        Meet The People
                        <span className="block text-blue-600">
                            Leading ADM
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Every successful product starts with exceptional leadership.
                        Our executive team combines technology, creativity and
                        business strategy to build remarkable digital experiences.
                    </p>
                </motion.div>

                {/* Cards */}

                <div className="space-y-16">

                    {leadership.map((member, index) => (

                        <motion.div
                            key={member.id}
                            initial={{
                                opacity: 0,
                                y: 40,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: index * 0.12,
                            }}
                            className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                                }`}
                        >
                            {/* Image */}

                            <div className="group relative overflow-hidden rounded-[34px]">

                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={900}
                                    height={900}
                                    className="h-[650px] w-full object-cover transition duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-8">

                                    <div className="flex gap-4">

                                        {[FaLinkedinIn, FaGithub, Mail].map((Icon, i) => (
                                            <button
                                                key={i}
                                                className="rounded-full bg-white/15 p-3 text-white backdrop-blur-xl transition hover:bg-blue-600"
                                            >
                                                <Icon size={18} />
                                            </button>
                                        ))}

                                    </div>

                                </div>

                            </div>

                            {/* Content */}

                            <div>

                                <span className="font-semibold uppercase tracking-[0.3em] text-blue-600">
                                    {member.role}
                                </span>

                                <h3 className="mt-5 text-5xl font-black text-slate-900">
                                    {member.name}
                                </h3>

                                <p className="mt-8 text-lg leading-9 text-slate-600">
                                    {member.short}
                                </p>

                                <div className="mt-10 flex flex-wrap gap-3">

                                    {member.expertise.map((skill) => (

                                        <span
                                            key={skill}
                                            className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
                                        >
                                            {skill}
                                        </span>

                                    ))}

                                </div>

                                <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8">

                                    <h4 className="text-xl font-bold text-slate-900">
                                        Leadership Philosophy
                                    </h4>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        "Technology should solve real business problems,
                                        create meaningful experiences and empower people—
                                        not complicate their lives."
                                    </p>

                                </div>

                                <button className="group mt-10 inline-flex items-center font-semibold text-blue-600">

                                    View Full Profile

                                    <ArrowUpRight
                                        className="ml-2 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                                        size={20}
                                    />

                                </button>

                            </div>

                        </motion.div>

                    ))}

                </div>

            </div>

        </section>
    );
}