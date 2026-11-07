import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function TeamFinalCTA() {
    return (
        <section className="relative isolate overflow-hidden border-t border-white/[0.06] bg-[#071423] py-20 sm:py-24">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(43,124,255,0.17),transparent_58%)]"
            />
            <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
                <p className="text-label">Build with ADM</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Reliable products start with thoughtful collaboration.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
                    We bring clear leadership and considered engineering to every digital product we build.
                </p>
                <Link
                    href="/consultation"
                    className="site-button-primary mt-8"
                >
                    <CalendarDays aria-hidden="true" size={17} />
                    Start a conversation
                    <ArrowRight aria-hidden="true" size={16} />
                </Link>
            </div>
        </section>
    );
}
