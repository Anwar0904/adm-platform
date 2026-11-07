import Link from "next/link";
import { ArrowDown, Code2, Compass } from "lucide-react";

export default function TeamHero() {
    return (
        <section className="relative isolate overflow-hidden border-b border-white/[0.06] bg-[#050d1a]">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_30%,rgba(43,124,255,0.16),transparent_38%),radial-gradient(ellipse_at_95%_75%,rgba(34,211,238,0.08),transparent_32%)]"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,#7db4ff_1px,transparent_1px),linear-gradient(to_bottom,#7db4ff_1px,transparent_1px)] [background-size:72px_72px]"
            />

            <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-14 px-5 pb-20 pt-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-32">
                <div className="max-w-3xl">
                    <p className="hero-kicker">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        Meet our leadership.
                    </p>

                    <h1 className="mt-8 max-w-3xl text-[clamp(2.8rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
                        The People Behind{" "}
                        <span className="bg-gradient-to-r from-brand-300 via-brand-200 to-cyan-300 bg-clip-text text-transparent">
                            the Vision.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
                        At Arazi Digital Media, leadership and engineering work closely to turn business goals into thoughtful digital products—grounded in clear direction, dependable execution, and close collaboration.
                    </p>

                    <Link
                        href="#leadership"
                        className="site-button-primary mt-9"
                    >
                        Meet the leadership
                        <ArrowDown aria-hidden="true" size={17} />
                    </Link>
                </div>

                <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
                    <div
                        aria-hidden="true"
                        className="absolute -right-7 -top-8 h-40 w-40 rounded-full border border-cyan-300/15"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute -bottom-7 -left-7 h-36 w-36 rounded-full border border-brand-300/15"
                    />

                    <div className="relative space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-soft backdrop-blur-sm sm:p-7">
                        <p className="text-label">How we lead</p>

                        <div className="flex items-center gap-5 rounded-2xl border border-white/[0.08] bg-slate-950/60 p-5 sm:p-6">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-cyan-200">
                                <Compass aria-hidden="true" size={23} />
                            </span>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                                    Executive leadership
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Vision, direction and partnership
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 rounded-2xl border border-white/[0.08] bg-slate-950/60 p-5 sm:p-6">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-200">
                                <Code2 aria-hidden="true" size={23} />
                            </span>
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-200">
                                    Technical leadership
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Engineering, coordination and delivery
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1 pt-2 text-sm text-slate-400">
                            <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-brand-400 to-cyan-300" />
                            Thoughtful leadership. Reliable engineering.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
