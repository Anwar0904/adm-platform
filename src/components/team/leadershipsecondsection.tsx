
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const governanceGroups = [
    {
        id: "leadership-board",
        title: "Board of Arazi Digital Media",
        href: "/about/leadership-governance/leadership-board",
        description: "View the published profiles assigned to this group.",
    },
    {
        id: "executive-committee",
        title: "Executive Committee",
        href: "/about/leadership-governance/executive-committee",
        description: "View the published profiles assigned to this group.",
    },
    {
        id: "management-committee",
        title: "Management Committee",
        href: "/about/leadership-governance/management-committee",
        description: "View the published profiles assigned to this group.",
    },
];

export default function LeadershipOverview() {
    return (
        <section className="bg-[#050d1a]">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-12">

                    {governanceGroups.map((group, index) => (
                        <article
                            key={group.id}
                            className={`flex flex-col ${
                                index > 0
                                    ? "sm:border-l sm:border-white/[0.09] sm:pl-8 lg:pl-10"
                                    : ""
                            }`}
                        >
                            {/* Heading */}
                            <h2 className="max-w-sm text-2xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-[26px] lg:text-[27px]">
                                {group.title}
                            </h2>

                            {/* Description */}
                            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400 sm:text-[15px] sm:leading-8">
                                {group.description}
                            </p>

                            {/* Link */}
                            <div className="mt-auto pt-7">
                                <Link
                                    href={group.href}
                                    className="group inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                                >
                                    View profiles

                                    <ArrowUpRight
                                        aria-hidden="true"
                                        size={17}
                                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </Link>
                            </div>
                        </article>
                    ))}

                </div>
            </div>
        </section>
    );
}
