import Link from "next/link";
import {
    Mail,
    MapPin,
    ArrowUpRight,
} from "lucide-react";
import {
    FaGithub,
    FaLinkedinIn,
} from "react-icons/fa";
import { profile } from "@/config/profile";

const services = [
    {
        name: "Full-stack development",
        href: "/services/web-development",
    },
    {
        name: "Backend & APIs",
        href: "/services",
    },
    {
        name: "AI integrations",
        href: "/services/ai-solutions",
    },
    {
        name: "Interface implementation",
        href: "/services/ui-ux",
    },
];

const navigation = [
    {
        name: "Projects",
        href: "/portfolio",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Expertise",
        href: "/services",
    },
    {
        name: "Writing",
        href: "/blogs",
    },
    {
        name: "Contact",
        href: "/contact",
    },
];

const socials = [
    {
        icon: FaLinkedinIn,
        href: profile.socialLinks.linkedin,
    },
    {
        icon: FaGithub,
        href: profile.socialLinks.github,
    },
].filter((social) => social.href);

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#241a16] text-[#f7f0e6]">

            {/* Background */}

            <div className="absolute inset-0 opacity-[0.04]">

                <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-amber-500 blur-[120px]" />

                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-rose-400 blur-[120px]" />

            </div>

            <div className="relative">

                {/* CTA */}

                <section className="border-b border-white/10">

                    <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-12 sm:gap-8 sm:px-6 sm:py-16 lg:flex-row lg:py-20">

                        <div>

                            <p className="mb-3 text-xs font-semibold text-amber-300 sm:text-sm">
                                HAVE A PROJECT IN MIND?
                            </p>

                            <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">

                                Let&apos;s build something useful.

                            </h2>

                        </div>

                        <Link
                            href="/consultation"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-amber-500 sm:w-auto sm:gap-3 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
                        >
                            Start a Conversation

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

                                        {profile.name}

                                    </h2>

                                    <p className="text-sm text-slate-400">

                                        {profile.title}

                                    </p>

                                </div>

                            </Link>

                            <p className="max-w-md leading-8 text-slate-300">

                                {profile.shortIntroduction}

                            </p>

                            <div className="mt-10 flex gap-4">

                                {socials.map((social, index) => {

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

                        {/* Navigation */}

                        <div>

                            <h3 className="mb-6 text-base font-semibold sm:mb-8 sm:text-lg">

                                Explore

                            </h3>

                            <div className="space-y-5">

                                {navigation.map(
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

                                <div className="flex gap-4">

                                    <Mail className="mt-1 text-blue-400" />

                                    <div>

                                        <p className="text-sm text-slate-400">

                                            Email

                                        </p>

                                        <a href={`mailto:${profile.email}`} className="hover:text-cyan-300">
                                            {profile.email}
                                        </a>

                                    </div>

                                </div>

                                <div className="flex gap-4">

                                    <MapPin className="mt-1 text-blue-400" />

                                    <div>

                                        <p className="text-sm text-slate-400">

                                            Address

                                        </p>

                                        <p>

                                            {profile.location}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* Bottom */}

                <section className="border-t border-white/10">

                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-400 sm:gap-6 sm:px-6 sm:py-8 sm:text-sm md:flex-row">

                        <p>

                            © {new Date().getFullYear()} {profile.name}.
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