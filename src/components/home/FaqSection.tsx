import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

const faqs = [
  {
    question: "What services does ADM provide?",
    answer:
      "ADM specializes in AI solutions, web development, mobile applications, UI/UX design, enterprise software, cloud infrastructure, and digital transformation.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Depending on project scope, most projects are completed between 4–16 weeks using agile development.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. We offer maintenance, cloud monitoring, feature enhancements, and long-term technical support.",
  },
  {
    question: "Can ADM build AI-powered software?",
    answer:
      "Absolutely. AI automation, LLM integrations, chatbots, and intelligent workflows are our core expertise.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-slate-50 py-32 flex justify-center">

      <div className="container">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            FAQ
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Frequently Asked Questions
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Everything you need to know before starting your
            next digital project with ADM.
          </p>

        </div>

        <div className="mx-auto max-w-4xl space-y-5">

          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition-all open:border-blue-600 open:shadow-xl"
            >

              <summary className="flex cursor-pointer list-none items-center justify-between p-7">

                <h3 className="text-xl font-bold">
                  {faq.question}
                </h3>

                <div className="rounded-full bg-slate-100 p-3 transition group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
                  <Plus className="h-5 w-5" />
                </div>

              </summary>

              <div className="px-7 pb-7">

                <div className="h-px bg-slate-200 mb-6" />

                <p className="leading-8 text-muted-foreground">
                  {faq.answer}
                </p>

              </div>

            </details>
          ))}

        </div>

        <div className="mt-14 text-center">

          <Link
            href="/faq"
            className="inline-flex items-center gap-2 rounded-xl border px-8 py-4 font-semibold transition hover:bg-white hover:shadow-lg"
          >
            View All FAQs

            <ArrowRight className="h-5 w-5" />

          </Link>

        </div>

      </div>

    </section>
  );
}