
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const governanceGroups = [
    {
        id: "leadership-board",
        title: "Board of Arazi Digital Media",
        description:
            "Approved Board profiles will appear here after official records are assigned.",
    },
    {
        id: "executive-committee",
        title: "Executive Committee",
        description:
            "Approved Executive Committee profiles will appear here after official records are assigned.",
    },
    {
        id: "management-committee",
        title: "Management Committee",
        description:
            "Approved Management Committee profiles will appear here after official records are assigned.",
    },
];

export default function LeadershipOverview() {
    return (
        <section className="bg-[#050d1a]">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                    {governanceGroups.map((group) => (
                        <article key={group.id}>
                            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                {group.title}
                            </h2>

                            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
                                {group.description}
                            </p>

                            <Link
                                href={`#${group.id}`}
                                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                            >
                                View profiles
                                <ArrowUpRight aria-hidden="true" size={17} />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
