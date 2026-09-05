import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { profile } from "@/config/profile";

export const metadata = {
    title: "About",
    description: `Learn more about ${profile.name}, a ${profile.title}.`,
};

export default function AboutPage() {
    return (
        <>
            <section className="section-shell bg-[#f4eee5] text-[#241f1b]">
                <div className="section-content max-w-5xl">
                    <span className="section-kicker">About me</span>
                    <h1 className="section-title max-w-3xl text-[#241f1b]">
                        Full-stack development across web, backend, mobile, and modern applications.
                    </h1>
                    <p className="section-copy max-w-3xl text-[#665b50]">{profile.bio}</p>

                    <div className="mt-12 grid gap-8 border-t border-[#d8cbbb] pt-10 md:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <h2 className="text-2xl font-bold text-[#241f1b]">What I focus on</h2>
                            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                {profile.focusAreas.map((area) => (
                                    <li key={area} className="border-l-2 border-amber-500 pl-4 text-[#665b50]">
                                        {area}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4 rounded-2xl border border-[#d8cbbb] bg-[#fffaf2] p-6">
                            <p className="text-label text-[#a05b22]">Currently</p>
                            <p className="text-lg font-semibold text-[#241f1b]">{profile.availability}</p>
                            <p className="text-sm text-[#665b50]">{profile.location}</p>
                        </div>
                    </div>

                    <Link href="/contact" className="site-button-primary mt-10">
                        Start a conversation
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <section className="section-shell bg-[#211d19] text-[#f7f0e6]">
                <div className="section-content max-w-6xl">
                    <div className="mb-12 max-w-3xl">
                        <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-200/10 px-4 py-2 text-xs font-semibold text-amber-200 sm:px-5 sm:text-sm">
                            Expertise
                        </span>
                        <h2 className="mt-5 text-[clamp(2rem,3vw,3rem)] font-black leading-[1.08] text-[#fffaf2]">
                            A broad toolkit, grounded in real application work.
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {profile.expertise.map((item) => (
                            <article key={item.title} className="rounded-2xl border border-[#d8cbbb]/15 bg-[#2a2420] p-6">
                                <h3 className="text-xl font-bold text-amber-200">{item.title}</h3>
                                <p className="mt-3 leading-7 text-[#d8cbbb]">{item.description}</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {item.technologies.map((technology) => (
                                        <span key={technology} className="rounded-full border border-[#d8cbbb]/20 px-3 py-1.5 text-xs text-[#e4d8ca]">
                                            {technology}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
