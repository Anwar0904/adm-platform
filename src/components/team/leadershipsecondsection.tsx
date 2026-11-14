
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function LeadershipOverview() {
    return (
        <section className="bg-[#050d1a]">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">

                    {/* Leadership Board */}
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            The Leadership Board
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
                            Our Leadership Board provides strategic direction
                            and oversight, guiding the vision, priorities and
                            long-term growth of Arazi Digital Media. It helps
                            ensure our decisions remain aligned with our
                            values and ambitions.
                        </p>

                        <Link
                            href="#leadership-board"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-white"
                        >
                            Find out more
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>

                    {/* Executive Committee */}
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Executive Committee
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
                            Our Executive Committee is responsible for
                            leading business operations and implementing
                            our strategy. Its members coordinate teams,
                            oversee key functions and turn our vision
                            into meaningful results.
                        </p>

                        <Link
                            href="#executive-committee"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-white"
                        >
                            Find out more
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
