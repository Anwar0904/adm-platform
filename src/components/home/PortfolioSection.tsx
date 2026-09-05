import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";

type PortfolioItem = {
    title: string;
    slug: string;
    shortDescription?: string;
    featuredImage?: string | { url?: string } | null;
};

function mediaUrl(value: PortfolioItem["featuredImage"]) {
    if (!value) return null;
    return typeof value === "string" ? value : value.url ?? null;
}

export default async function PortfolioSection() {
    let projects: PortfolioItem[] = [];

    try {
        await connectDB();
        const result = await PublicContentService.getPortfolio({
            page: 1,
            limit: 3,
            featured: true,
        });
        projects = result.portfolio.map((project) => project.toObject() as PortfolioItem);
    } catch {
        projects = [];
    }

    return (
        <section className="section-shell bg-[#f4eee5] text-[#241f1b]">
            <div className="section-content">
                <div className="mb-12 flex flex-col gap-7 sm:mb-14 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <span className="section-kicker">Selected projects</span>
                        <h2 className="section-title max-w-3xl text-[#241f1b]">A closer look at my work</h2>
                        <p className="section-copy max-w-2xl text-[#665b50]">
                            Products, systems, and experiments built with care across the stack.
                        </p>
                    </div>

                    <Link
                        href="/portfolio"
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d8cbbb] bg-[#fffaf2] px-5 py-3.5 text-sm font-semibold text-[#3b3028] shadow-sm transition-all hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 hover:shadow-md sm:w-fit sm:px-6 sm:py-4"
                    >
                        View all projects
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                </div>

                {projects.length > 0 ? (
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => {
                            const image = mediaUrl(project.featuredImage);

                            return (
                                <article
                                    key={project.slug}
                                    className="group overflow-hidden rounded-2xl border border-[#d8cbbb] bg-[#211d19] shadow-[0_18px_40px_rgba(75,52,34,0.16)] transition-all duration-500 hover:-translate-y-1 hover:border-amber-500/60 sm:rounded-3xl"
                                >
                                    <div className="relative h-60 overflow-hidden bg-slate-800 sm:h-72 lg:h-80">
                                        {image ? (
                                            <Image
                                                src={image}
                                                alt={project.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-end bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-sm text-slate-400">
                                                Project preview unavailable
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 p-5 sm:p-7 lg:p-8">
                                        <div>
                                            <h3 className="text-xl font-bold leading-tight text-[#fffaf2] sm:text-2xl">
                                                {project.title}
                                            </h3>
                                            {project.shortDescription && (
                                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#d8cbbb]">
                                                    {project.shortDescription}
                                                </p>
                                            )}
                                        </div>

                                        <Link
                                            href={`/portfolio/${project.slug}`}
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition-all group-hover:gap-3 sm:text-base"
                                        >
                                            Read case study
                                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#cdbca9] bg-[#fffaf2] px-6 py-12 text-center text-[#76685b]">
                        Published projects will appear here as they are added.
                    </div>
                )}
            </div>
        </section>
    );
}
