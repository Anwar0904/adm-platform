import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <section
            aria-labelledby="not-found-title"
            className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16"
        >
            <div className="w-full max-w-5xl text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-black text-white drop-shadow-lg">404</h1>
                </div>

                <h2 id="not-found-title" className="mb-4 text-4xl font-bold text-white">
                    Page Not Found
                </h2>

                <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/20"
                    >
                        Contact Support
                    </Link>
                </div>

                <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-3">
                    <Link href="/services" className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
                        <h3 className="mb-2 font-bold text-white">Our Capabilities</h3>
                        <p className="text-sm text-slate-300">Explore our services and solutions</p>
                    </Link>

                    <Link href="/portfolio" className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
                        <h3 className="mb-2 font-bold text-white">Portfolio</h3>
                        <p className="text-sm text-slate-300">See our selected work and projects</p>
                    </Link>

                    <Link href="/blogs" className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
                        <h3 className="mb-2 font-bold text-white">Insights</h3>
                        <p className="text-sm text-slate-300">Read articles and company updates</p>
                    </Link>
                </div>
            </div>
        </section>
    );
}
