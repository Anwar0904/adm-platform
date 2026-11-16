import Link from "next/link";

export default function LeadershipDataError({
    retryHref,
    variant = "dark",
}: {
    retryHref: string;
    variant?: "dark" | "light";
}) {
    const isLight = variant === "light";

    return (
        <section
            role="alert"
            className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 sm:py-18 lg:px-10 lg:py-20"
        >
            <h2
                className={`text-xl font-semibold ${
                    isLight ? "text-slate-950" : "text-white"
                }`}
            >
                Leadership profiles are temporarily unavailable.
            </h2>
            <p
                className={`mt-3 text-sm leading-7 ${
                    isLight ? "text-slate-600" : "text-slate-400"
                }`}
            >
                Please try again in a moment.
            </p>
            <Link
                href={retryHref}
                className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isLight
                        ? "border-brand-700/40 text-brand-800 hover:bg-brand-50 hover:text-brand-900 focus-visible:outline-brand-700"
                        : "border-cyan-300/40 text-cyan-200 hover:bg-cyan-300/10 hover:text-white focus-visible:outline-cyan-300"
                }`}
            >
                Try again
            </Link>
        </section>
    );
}
