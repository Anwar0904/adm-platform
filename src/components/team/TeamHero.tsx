
export default function TeamHero() {
    return (
        <section className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden border-b border-white/[0.06] bg-[#050d1a]">

            {/* Existing brand atmosphere */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_12%,rgba(43,124,255,0.15),transparent_48%),radial-gradient(ellipse_at_85%_75%,rgba(34,211,238,0.07),transparent_35%)]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:linear-gradient(to_right,#7db4ff_1px,transparent_1px),linear-gradient(to_bottom,#7db4ff_1px,transparent_1px)] [background-size:72px_72px]"
            />

            <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 pb-8 pt-24 text-center sm:px-8 sm:pb-10 sm:pt-28 lg:px-10 lg:pt-24">

                {/* Eyebrow */}
                <div className="mb-5 inline-flex items-center gap-2.5">
                    <span className="h-px w-7 bg-brand-400/70" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300 sm:text-xs">
                        Arazi Digital Media
                    </span>
                    <span className="h-px w-7 bg-brand-400/70" />
                </div>

                {/* Heading */}
                <h1 className="text-[clamp(2.4rem,4.5vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
                    Leadership{" "}
                    <span className="bg-gradient-to-r from-brand-300 via-brand-200 to-cyan-300 bg-clip-text text-transparent">
                        &amp; Governance
                    </span>
                </h1>

                {/* Description */}
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                    Governance information and leadership profiles are
                    presented here only after their official details and
                    appointments have been approved.
                </p>

                {/* Brand panel */}
                <div className="relative mt-9 w-full max-w-[800px] sm:mt-10 lg:mt-11">

                    {/* Subtle decorative frame */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-[1.4rem] border border-white/[0.07] sm:-inset-3 sm:rounded-[1.8rem]"
                    />

                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#091629] shadow-[0_24px_70px_-25px_rgba(0,0,0,0.8)] sm:rounded-2xl">
                        <div
                            role="img"
                            aria-label="Arazi Digital Media Leadership and Governance"
                            className="relative flex aspect-video items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,rgba(43,124,255,0.2),transparent_52%),linear-gradient(145deg,#102039,#071423)]"
                        >
                            <div
                                aria-hidden="true"
                                className="absolute inset-8 rounded-[1.4rem] border border-white/[0.08] sm:inset-12 sm:rounded-[1.8rem]"
                            />
                            <div className="relative px-6 text-center">
                                <span className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300 sm:text-base">
                                    Arazi Digital Media
                                </span>
                                <p className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                                    Leadership &amp; Governance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom caption */}
                <div className="mt-5 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:mt-6">
                    <span className="h-px w-6 bg-brand-400/50" />
                    Vision · People · Progress
                    <span className="h-px w-6 bg-brand-400/50" />
                </div>

            </div>
        </section>
    );
}
