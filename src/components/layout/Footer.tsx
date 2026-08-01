import Link from "next/link";
import {
    Mail,
    MapPin,
    Phone,
    ArrowUpRight,
} from "lucide-react";
import {
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";

const services = [
    {
        name: "Web Development",
        href: "/services/web-development",
    },
    {
        name: "Mobile Apps",
        href: "/services/mobile-apps",
    },
    {
        name: "AI Solutions",
        href: "/services/ai-solutions",
    },
    {
        name: "UI / UX Design",
        href: "/services/ui-ux",
    },
];

const company = [
    {
        name: "Portfolio",
        href: "/portfolio",
    },
    {
        name: "Industries",
        href: "/industries",
    },
    {
        name: "Team",
        href: "/team",
    },
    {
        name: "Blog",
        href: "/blog",
    },
];

const socials = [
    {
        icon: FaFacebookF,
        href: "#",
    },
    {
        icon: FaLinkedinIn,
        href: "#",
    },
    {
        icon: FaGithub,
        href: "#",
    },
    {
        icon: FaInstagram,
        href: "#",
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

                    <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 py-16 lg:flex-row">

                        <div>

                            <p className="mb-3 text-blue-400 font-semibold">
                                READY TO BUILD SOMETHING AMAZING?
                            </p>

                            <h2 className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl">

                                Let's create digital experiences your customers will love.

                            </h2>

                        </div>

                        <Link
                            href="/consultation"
                            className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-700"
                        >
                            Book Consultation

                            <ArrowUpRight size={18} />

                        </Link>

                    </div>

                </section>

                {/* Footer */}

                <section className="container mx-auto px-6 py-20">

                    <div className="grid gap-14 lg:grid-cols-[2fr_1fr_1fr_1.3fr]">

                        {/* Brand */}

                        <div>

                            <Link
                                href="/"
                                className="mb-8 flex items-center gap-4"
                            >

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold">

                                    A

                                </div>

                                <div>

                                    <h2 className="text-2xl font-bold">

                                        ADM

                                    </h2>

                                    <p className="text-sm text-slate-400">

                                        Arazi Digital Media

                                    </p>

                                </div>

                            </Link>

                            <p className="max-w-md leading-8 text-slate-300">

                                ADM helps businesses grow through
                                premium web development, AI-powered
                                solutions, UI/UX design, branding,
                                and digital transformation.

                            </p>

                            <div className="mt-10 flex gap-4">

                                {socials.map((social,index) => {

                                    const Icon = social.icon;

                                    return (
                                        <Link
                                            key={index}
                                            href={social.href}
                                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600"
                                        >
                                            <Icon
                                                size={18}
                                            />
                                        </Link>
                                    );
                                })}

                            </div>

                        </div>

                        {/* Services */}

                        <div>

                            <h3 className="mb-8 text-lg font-semibold">

                                Services

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

                            <h3 className="mb-8 text-lg font-semibold">

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

                            <h3 className="mb-8 text-lg font-semibold">

                                Contact

                            </h3>

                            <div className="space-y-7">

                                <div className="flex gap-4">

                                    <Mail className="mt-1 text-blue-400" />

                                    <div>

                                        <p className="text-sm text-slate-400">

                                            Email

                                        </p>

                                        <p>

                                            hello@adm.com

                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-4">

                                    <Phone className="mt-1 text-blue-400" />

                                    <div>

                                        <p className="text-sm text-slate-400">

                                            Phone

                                        </p>

                                        <p>

                                            +92 300 0000000

                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-4">

                                    <MapPin className="mt-1 text-blue-400" />

                                    <div>

                                        <p className="text-sm text-slate-400">

                                            Address

                                        </p>

                                        <p>

                                            Pakistan

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* Bottom */}

                <section className="border-t border-white/10">

                    <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 py-8 text-sm text-slate-400 md:flex-row">

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