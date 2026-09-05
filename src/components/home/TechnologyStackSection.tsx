import { profile } from "@/config/profile";

export default function TechnologyStackSection() {
    return (
        <section className="section-shell bg-[#211d19] text-[#f7f0e6]">
            <div className="section-content">
                <div className="mb-12 max-w-3xl sm:mb-16">
                    <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-200/10 px-4 py-2 text-xs font-semibold text-amber-200 sm:px-5 sm:text-sm">
                        Technical stack
                    </span>
                    <h2 className="mt-5 text-[clamp(2rem,3vw,3rem)] font-black leading-[1.08] text-[#fffaf2]">
                        Tools I use to turn ideas into working products.
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[#d8cbbb] sm:text-lg sm:leading-8">
                        My work spans interfaces, application logic, data, mobile experiences, CMS platforms, and developer tooling.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.technologyGroups.map((group) => (
                        <article
                            key={group.name}
                            className="rounded-2xl border border-[#d8cbbb]/15 bg-[#2a2420] p-5 transition-colors hover:border-amber-400/50 sm:p-6"
                        >
                            <h3 className="text-lg font-bold text-amber-200">{group.name}</h3>
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {group.technologies.map((technology) => (
                                    <li
                                        key={technology}
                                        className="rounded-full border border-[#d8cbbb]/20 px-3 py-1.5 text-xs font-medium text-[#e4d8ca]"
                                    >
                                        {technology}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
