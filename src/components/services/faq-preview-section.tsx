
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const faqs = [
  {
    question: "How long does a project take?",
    answer:
      "Depending on complexity, projects typically take between 4–16 weeks.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. We provide maintenance, monitoring, feature updates and technical support.",
  },
  {
    question: "Can you modernize existing software?",
    answer:
      "Absolutely. We upgrade legacy systems into scalable modern platforms.",
  },
  {
    question: "Do you build AI-powered solutions?",
    answer:
      "Yes. AI automation and intelligent software are one of ADM's core specialties.",
  },
];

export default function FAQPreviewSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            FAQ
          </span>

          <h2 className="mt-6 text-4xl font-black">
            Frequently Asked Questions
          </h2>

          <p className="mt-5 text-slate-600">
            Everything clients usually ask before starting a project.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <button
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <h3 className="text-lg font-semibold">
                  {faq.question}
                </h3>

                <ChevronDown
                  className={`transition ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {open === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-slate-600">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/faq"
            className="font-semibold text-blue-600 hover:underline"
          >
            View All FAQs →
          </Link>
        </div>
      </div>
    </section>
  );
}