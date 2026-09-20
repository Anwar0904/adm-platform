import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    Cookie,
    FileText,
    LockKeyhole,
    Mail,
    Scale,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

export type LegalSection = {
    id: string;
    title: string;
    paragraphs?: string[];
    bullets?: string[];
};

type LegalPageProps = {
    eyebrow: string;
    currentHref: string;
    title: string;
    summary: string;
    updated: string;
    icon: LucideIcon;
    accent: string;
    sections: LegalSection[];
};

const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
];

export default function LegalPage({
    eyebrow,
    currentHref,
    title,
    summary,
    updated,
    icon: PageIcon,
    accent,
    sections,
}: LegalPageProps) {
    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.2),transparent_38%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.12),transparent_34%)]" />

            <header className="relative border-b border-white/10">
                <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
                    <Link
                        href="/"
                        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-300"
                    >
                        <ArrowLeft size={16} />
                        Back to ADM
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-end">
                        <div className="max-w-3xl">
                            <div className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                                    <PageIcon size={19} />
                                </span>
                                {eyebrow}
                            </div>
                            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
                                {title}
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                                {summary}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                                    <ShieldCheck size={21} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        Document status
                                    </p>
                                    <p className="mt-1 font-semibold text-white">Current and transparent</p>
                                </div>
                            </div>
                            <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">
                                Last updated {updated}. We review these details as our products and practices evolve.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:py-20">
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Legal centre</p>
                    <nav className="grid gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-2" aria-label="Legal pages">
                        {legalLinks.map((link) => {
                            const isActive = link.href === currentHref;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-6 hidden rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 lg:block">
                        <Mail className="mb-3 text-cyan-300" size={19} />
                        <p className="text-sm font-semibold text-white">Questions about this page?</p>
                        <Link href="/contact" className="mt-2 inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200">
                            Contact our team <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </aside>

                <article className="min-w-0 max-w-3xl">
                    <div className="mb-10 grid gap-3 sm:grid-cols-3">
                        {[
                            { icon: LockKeyhole, label: "Respectful by design" },
                            { icon: Scale, label: "Plain-language terms" },
                            { icon: CheckCircle2, label: "Easy to revisit" },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-sm font-medium text-slate-300">
                                <Icon size={17} className="shrink-0 text-cyan-300" />
                                {label}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <section key={section.id} id={section.id} className="scroll-mt-28">
                                <div className="mb-4 flex items-start gap-4">
                                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 text-xs font-bold text-blue-300">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{section.title}</h2>
                                </div>
                                <div className="ml-12 space-y-4 text-base leading-8 text-slate-300">
                                    {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                                    {section.bullets && (
                                        <ul className="space-y-3 border-l border-blue-400/25 pl-5 text-slate-300">
                                            {section.bullets.map((bullet) => (
                                                <li key={bullet} className="flex gap-3">
                                                    <CheckCircle2 className="mt-1 shrink-0 text-cyan-300" size={17} />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mt-16 flex flex-col gap-5 rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-600/15 to-cyan-400/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                        <div>
                            <p className="text-lg font-bold text-white">Need a clearer answer?</p>
                            <p className="mt-1 text-sm leading-6 text-slate-400">Our team is happy to explain how these terms apply to your project.</p>
                        </div>
                        <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">
                            Talk to ADM <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
}

export const legalIcons = {
    privacy: LockKeyhole,
    terms: FileText,
    cookies: Cookie,
};