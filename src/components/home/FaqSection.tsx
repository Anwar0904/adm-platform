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
      "Depending on project scope, most projects are completed between 4–16 weeks using an agile development process.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. We offer maintenance, cloud monitoring, feature enhancements, performance optimization, and long-term technical support.",
  },
  {
    question: "Can ADM build AI-powered software?",
    answer:
      "Absolutely. AI automation, LLM integrations, intelligent assistants, chatbots, and AI-powered business workflows are among our core capabilities.",
  },
];

export default function FaqSection() {
  return (
    <section className="flex justify-center bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="container w-full">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 sm:px-5 sm:text-sm">
            FAQ
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Everything you need to know before starting your next digital
            project with ADM.
          </p>
        </div>

        {/* FAQs */}
        <div className="mx-auto max-w-4xl space-y-3 sm:space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                open:border-blue-500
                open:shadow-lg
                sm:rounded-3xl
              "
            >
              <summary
                className="
                  flex
                  cursor-pointer
                  list-none
                  items-center
                  justify-between
                  gap-4
                  p-5
                  sm:p-6
                  lg:p-7
                "
              >
                <h3 className="text-base font-bold leading-6 text-slate-900 sm:text-lg lg:text-xl">
                  {faq.question}
                </h3>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 group-open:rotate-45 group-open:bg-blue-600 group-open:text-white sm:h-10 sm:w-10">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </summary>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7">
                <div className="mb-4 h-px bg-slate-200 sm:mb-5" />

                <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center sm:mt-14">
          <Link
            href="/faq"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-6
              py-3.5
              text-sm
              font-semibold
              text-slate-900
              shadow-sm
              transition-all
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
              hover:shadow-lg
              sm:w-auto
              sm:px-8
              sm:py-4
              sm:text-base
            "
          >
            View All FAQs
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}