"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "How does ADM support career growth?",
        answer:
            "We invest in continuous learning, mentorship, and hands-on opportunities so every team member can grow in their role.",
    },
    {
        question: "What does the hiring process look like?",
        answer:
            "Our hiring process includes a conversation with our talent team, a technical interview, and a final culture-fit discussion.",
    },
    {
        question: "Can I work remotely or from a hybrid schedule?",
        answer:
            "Yes. ADM offers flexible remote and hybrid arrangements while keeping collaboration and team connection at the center.",
    },
    {
        question: "What kind of projects will I work on?",
        answer:
            "You will work on AI-enabled digital products and enterprise-grade solutions that solve real business challenges.",
    },
];

export default function TeamFAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative overflow-hidden bg-slate-50 py-24">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                        People Questions
                    </span>

                    <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
                        Common Questions
                        <span className="block text-blue-600">about working at ADM</span>
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Learn how we support our teams, structure our hiring, and build a culture of growth.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-6 lg:grid-cols-2">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.button
                                key={faq.question}
                                type="button"
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group w-full rounded-4xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-blue-300 hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {faq.question}
                                        </h3>
                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                                        {isOpen ? (
                                            <ChevronUp className="h-5 w-5" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5" />
                                        )}
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="mt-5 text-slate-600 leading-7">
                                        {faq.answer}
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
