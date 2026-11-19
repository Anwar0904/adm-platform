import Link from "next/link";
import { publicRoutes } from "@/config/site";
import { ArrowUpRight } from "lucide-react";
import { companyContact } from "@/config/company-contact";

const services = [
    {
        name: "Technology",
        href: "/services/technology",
    },
    {
        name: "Marketing",
        href: "/services/marketing",
    },
    {
        name: "Artificial Intelligence",
        href: "/services/ai",
    },
    {
        name: "Data",
        href: "/services/data",
    },
];

const company = [
    {
        name: "Selected Work",
        href: "/portfolio",
    },
    {
        name: "Industries",
        href: "/industries",
    },
    {
        name: "Leadership & Governance",
        href: "/about/leadership-governance",
    },
    {
        name: "Careers",
        href: publicRoutes.careers,
    },
    {
        name: "Insights",
        href: "/blogs",
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#071426] text-white">

            {/* Background */}

            <div className="absolute inset-0 opacity-[0.04]">

                <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-blue-600 blur-[120px]" />

                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400 blur-[120px]" />

            </div>

            <div className="relative">

                {/* CTA */}

                <section className="border-b border-white/10">

                    <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-12 sm:gap-8 sm:px-6 sm:py-16 lg:flex-row lg:py-20">

                        <div>

                            <p className="mb-3 text-xs font-semibold text-blue-400 sm:text-sm">
                                READY TO BUILD SOMETHING AMAZING?
                            </p>

                            <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">

                                Let&apos;s create digital experiences your customers will love.

                            </h2>

                        </div>

                        <Link
                            href="/consultation"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:bg-blue-700 sm:w-auto sm:gap-3 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
                        >
                            Book Consultation

                            <ArrowUpRight size={16} className="sm:h-[18px] sm:w-[18px]" />

                        </Link>

                    </div>

                </section>

                {/* Footer */}

                <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-20">

                    <div className="grid gap-8 sm:gap-10 lg:gap-14 lg:grid-cols-[2fr_1fr_1fr_1.3fr]">

                        {/* Brand */}

                        <div>

                            <Link
                                href="/"
                                className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4"
                            >

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">

                                    A

                                </div>

                                <div>

                                    <h2 className="text-lg font-bold sm:text-2xl">

                                        ADM

                                    </h2>

                                    <p className="text-sm text-slate-400">

                                        Arazi Digital Media

                                    </p>

                                </div>

                            </Link>

                            <p className="max-w-md leading-8 text-slate-300">

                                ADM helps businesses grow through
                                premium digital platforms, AI-powered
                                intelligent systems, UI/UX design, branding,
                                and digital transformation.

                            </p>

                            {companyContact.socialProfiles.length > 0 && (
                                <div className="mt-10 flex gap-4">
                                    {companyContact.socialProfiles.map((profile) => (
                                        <Link key={profile.label} href={profile.href} aria-label={profile.label}>
                                            {profile.label}
                                        </Link>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Services */}

                        <div>

                            <h3 className="mb-6 text-base font-semibold sm:mb-8 sm:text-lg">

                                Capabilities

                            </h3>

                            <div className="space-y-5">

                                {services.map(
                                    (item) => (
                                        <Link
                                            key={
                                                item.href
                                            }
                                            href={
                                                item.href
                                            }
                                            className="block text-slate-300 transition hover:translate-x-2 hover:text-blue-400"
                                        >
                                            {
                                                item.name
                                            }
                                        </Link>
                                    )
                                )}

                            </div>

                        </div>

                        {/* Company */}

                        <div>

                            <h3 className="mb-6 text-base font-semibold sm:mb-8 sm:text-lg">

                                Company

                            </h3>

                            <div className="space-y-5">

                                {company.map(
                                    (item) => (
                                        <Link
                                            key={
                                                item.href
                                            }
                                            href={
                                                item.href
                                            }
                                            className="block text-slate-300 transition hover:translate-x-2 hover:text-blue-400"
                                        >
                                            {
                                                item.name
                                            }
                                        </Link>
                                    )
                                )}

                            </div>

                        </div>

                        {/* Contact */}

                        <div>

                            <h3 className="mb-6 text-base font-semibold sm:mb-8 sm:text-lg">

                                Contact

                            </h3>

                            <div className="space-y-7">
                                {companyContact.email ? (
                                    <a className="block hover:text-blue-400" href={`mailto:${companyContact.email}`}>
                                        {companyContact.email}
                                    </a>
                                ) : (
                                    <Link className="hover:text-blue-400" href="/contact">
                                        Use the contact form to reach our team
                                    </Link>
                                )}
                                {companyContact.phone && <a href={`tel:${companyContact.phone}`}>{companyContact.phone}</a>}
                                {companyContact.address && <p>{companyContact.address}</p>}
                            </div>

                        </div>

                    </div>

                </section>

                {/* Bottom */}

                <section className="border-t border-white/10">

                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-400 sm:gap-6 sm:px-6 sm:py-8 sm:text-sm md:flex-row">

                        <p>

                            © {new Date().getFullYear()} Arazi Digital Media.
                            All Rights Reserved.

                        </p>

                        <div className="flex gap-8">

                            <Link
                                href="/privacy-policy"
                                className="hover:text-blue-400"
                            >
                                Privacy Policy
                            </Link>

                            <Link
                                href="/terms"
                                className="hover:text-blue-400"
                            >
                                Terms of Service
                            </Link>

                            <Link
                                href="/cookies"
                                className="hover:text-blue-400"
                            >
                                Cookies
                            </Link>

                        </div>

                    </div>

                </section>

            </div>

        </footer>
    );
}
