"use client";

import { useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
    Search,
    ChevronDown,
    HelpCircle,
} from "lucide-react";

const faqs = [
    {
        category: "General",
        question: "How quickly do you respond to inquiries?",
        answer:
            "Our team typically responds within 24 business hours. Urgent enterprise inquiries are prioritized whenever possible.",
    },
    {
        category: "Projects",
        question: "Can you work with international clients?",
        answer:
            "Absolutely. ADM works with businesses worldwide through online meetings, collaborative tools and agile workflows.",
    },
    {
        category: "Pricing",
        question: "Do you provide fixed-price quotations?",
        answer:
            "Yes. After understanding your requirements, we prepare a transparent proposal with estimated cost, timeline and deliverables.",
    },
    {
        category: "Development",
        question: "Which technologies do you specialize in?",
        answer:
            "We build solutions using Next.js, React, AI, Node.js, Cloud, DevOps, Blockchain, Mobile Apps and modern enterprise technologies.",
    },
    {
        category: "Support",
        question: "Do you provide post-launch support?",
        answer:
            "Yes. We provide maintenance, monitoring, feature enhancements and long-term technical support after deployment.",
    },
    {
        category: "Consultation",
        question: "Is the initial consultation free?",
        answer:
            "Yes. Every project begins with a completely free consultation to understand your goals and recommend the best solution.",
    },
];

export default function ContactFAQSection() {
    const [search, setSearch] = useState("");

    const [active, setActive] = useState<number | null>(0);

    const filteredFAQs = useMemo(() => {
        return faqs.filter((faq) =>
            (
                faq.question +
                faq.answer +
                faq.category
            )
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <section className="relative overflow-hidden py-24 lg:py-32">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

            <div className="container mx-auto px-4 lg:px-8">
                {/* Heading */}

                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        <HelpCircle size={16} />
                        Frequently Asked Questions
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-6xl">
                        Questions?
                        <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            We've Got Answers
                        </span>
                    </h2>

                    <p className="mt-6 text-lg leading-9 text-slate-600">
                        Find quick answers about our process,
                        pricing and collaboration.
                    </p>
                </div>

                {/* Search */}

                <div className="mx-auto mt-14 max-w-2xl">
                    <div className="relative">
                        <Search
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={20}
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search questions..."
                            className="h-16 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 shadow-sm outline-none transition focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* FAQ */}

                <div className="mx-auto mt-16 max-w-4xl space-y-5">
                    {filteredFAQs.map((faq, index) => {
                        const opened = active === index;

                        return (
                            <motion.div
                                key={faq.question}
                                layout
                                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                            >
                                <button
                                    onClick={() =>
                                        setActive(
                                            opened ? null : index
                                        )
                                    }
                                    className="flex w-full items-center justify-between gap-6 p-8 text-left"
                                >
                                    <div>
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {faq.category}
                                        </span>

                                        <h3 className="mt-4 text-xl font-bold text-slate-900">
                                            {faq.question}
                                        </h3>
                                    </div>

                                    <motion.div
                                        animate={{
                                            rotate: opened
                                                ? 180
                                                : 0,
                                        }}
                                    >
                                        <ChevronDown />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {opened && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            transition={{
                                                duration: 0.25,
                                            }}
                                        >
                                            <div className="border-t border-slate-100 px-8 pb-8 pt-6 text-slate-600 leading-8">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}