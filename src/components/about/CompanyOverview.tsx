import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import CompanyVideo from "@/components/about/CompanyVideo";
import {
    companyCapabilities,
    companyContent,
    companyMedia,
    companyMediaPoster,
} from "@/components/about/company-content";

export default function CompanyOverview() {
    return (
        <div className="bg-surface text-text">
            <section aria-labelledby="company-hero-heading" className="bg-surface">
                <div className="mx-auto max-w-[1440px] px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
                    <h1
                        id="company-hero-heading"
                        className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300"
                    >
                        Our Company
                    </h1>
                    <p className="mt-5 max-w-5xl text-[clamp(1.7rem,3.8vw,3.5rem)] font-medium leading-[1.13] tracking-[-0.035em]">
                        {companyContent.introduction}
                    </p>

                    <div className="mt-10 sm:mt-14 lg:mt-16">
                        <CompanyVideo
                            src={companyMedia.companyHero}
                            poster={companyMediaPoster}
                            label="Company introduction"
                        />
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="company-overview-heading"
                className="bg-surface-alt py-16 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2
                            id="company-overview-heading"
                            className="text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.04em]"
                        >
                            {companyContent.overviewHeading}
                        </h2>
                        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                            {companyContent.overviewDescription}
                        </p>
                    </div>

                    <div className="mt-10 grid items-center gap-8 sm:mt-14 lg:grid-cols-[1.45fr_0.75fr] lg:gap-16">
                        <CompanyVideo
                            src={companyMedia.companyOverview}
                            poster={companyMediaPoster}
                            label="Company overview"
                        />
                        <div className="max-w-xl lg:py-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">
                                Arazi Digital Media
                            </p>
                            <p className="mt-5 text-lg leading-8 text-text-muted sm:text-xl sm:leading-9">
                                {companyContent.overviewCompanyDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="capabilities-heading"
                className="bg-surface py-16 sm:py-20 lg:py-24"
            >
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-soft">
                                Our Capabilities
                            </p>
                            <h2
                                id="capabilities-heading"
                                className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl"
                            >
                                Four capabilities. One connected vision.
                            </h2>
                        </div>
                        <Link
                            href="/services"
                            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                        >
                            Explore all capabilities
                            <ArrowUpRight aria-hidden="true" size={16} />
                        </Link>
                    </div>

                    <nav
                        aria-label="ADM capabilities"
                        className="mt-9 grid grid-cols-2 border-y border-border sm:mt-12 md:grid-cols-4"
                    >
                        {companyCapabilities.map((capability) => (
                            <a
                                key={capability.id}
                                href={`#${capability.id}`}
                                className="group flex min-h-28 flex-col justify-between border-b border-border px-4 py-5 transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 sm:min-h-32 sm:px-6 sm:py-6 md:border-b-0 md:border-r md:last:border-r-0"
                            >
                                <span className="text-xs font-medium tracking-[0.16em] text-text-soft">
                                    {capability.number}
                                </span>
                                <span className="mt-5 text-lg font-semibold uppercase tracking-[0.06em] text-text transition-colors group-hover:text-brand-300 sm:text-xl">
                                    {capability.label}
                                </span>
                            </a>
                        ))}
                    </nav>
                </div>
            </section>

            {companyCapabilities.map((capability, index) => {
                const mediaOnRight = capability.mediaPosition === "right";

                return (
                    <section
                        key={capability.id}
                        id={capability.id}
                        aria-labelledby={`${capability.id}-heading`}
                        className={`scroll-mt-20 py-14 sm:py-20 lg:py-24 ${
                            index % 2 === 0 ? "bg-surface-alt" : "bg-surface"
                        }`}
                    >
                        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
                            <div
                                className={`${
                                    mediaOnRight
                                        ? "order-1 lg:order-2"
                                        : "order-1"
                                }`}
                            >
                                <CompanyVideo
                                    src={capability.media}
                                    poster={companyMediaPoster}
                                    label={`${capability.title} capability`}
                                />
                            </div>

                            <div
                                className={`max-w-xl py-2 sm:py-5 ${
                                    mediaOnRight
                                        ? "order-2 lg:order-1 lg:justify-self-end"
                                        : "order-2"
                                }`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">
                                    Capability {capability.number}
                                </p>
                                <h2
                                    id={`${capability.id}-heading`}
                                    className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl"
                                >
                                    {capability.title}
                                </h2>
                                <p className="mt-5 max-w-lg text-lg leading-8 text-text-muted sm:text-xl sm:leading-9">
                                    {capability.description}
                                </p>
                            </div>
                        </div>
                    </section>
                );
            })}

            <section
                id="our-story"
                aria-labelledby="story-heading"
                className="bg-surface-alt py-16 sm:py-20 lg:py-28"
            >
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                    <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-soft">
                                Company story
                            </p>
                            <h2
                                id="story-heading"
                                className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl"
                            >
                                Our Story
                            </h2>
                            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-300">
                                {companyContent.story.status}
                            </p>
                        </div>
                        <p className="max-w-4xl text-2xl font-medium leading-snug tracking-[-0.025em] text-text sm:text-3xl lg:text-[2.6rem]">
                            {companyContent.story.text}
                        </p>
                    </div>

                    <div className="mt-14 grid gap-10 border-t border-border pt-9 sm:mt-20 sm:grid-cols-2 sm:gap-14 lg:mt-24">
                        <article aria-labelledby="vision-heading">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-300">
                                {companyContent.vision.status}
                            </p>
                            <h3
                                id="vision-heading"
                                className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl"
                            >
                                Our Vision
                            </h3>
                            <p className="mt-4 max-w-xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                                {companyContent.vision.text}
                            </p>
                        </article>
                        <article
                            aria-labelledby="mission-heading"
                            className="border-t border-border pt-8 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0 lg:pl-14"
                        >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-300">
                                {companyContent.mission.status}
                            </p>
                            <h3
                                id="mission-heading"
                                className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl"
                            >
                                Our Mission
                            </h3>
                            <p className="mt-4 max-w-xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                                {companyContent.mission.text}
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section
                id="selected-work"
                aria-labelledby="selected-work-heading"
                className="bg-surface py-16 text-text sm:py-20 lg:py-28"
            >
                <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:px-12">
                    <div className="max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                            Selected Work
                        </p>
                        <h2
                            id="selected-work-heading"
                            className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl"
                        >
                            {companyContent.selectedWorkHeading}
                        </h2>
                        <p className="mt-5 text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                            {companyContent.selectedWork}
                        </p>
                        <Link
                            href="/portfolio"
                            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                        >
                            Explore Selected Work
                            <ArrowUpRight aria-hidden="true" size={16} />
                        </Link>
                    </div>

                    <CompanyVideo
                        src={companyMedia.selectedWork}
                        poster={companyMediaPoster}
                        label="Selected work media preview"
                    />
                </div>
            </section>

            <section
                aria-labelledby="closing-heading"
                className="relative isolate min-h-[34rem] overflow-hidden bg-surface sm:min-h-[42rem] lg:min-h-[50rem]"
            >
                <CompanyVideo
                    src={companyMedia.closingCampaign}
                    poster={companyMediaPoster}
                    label="Closing campaign"
                    cover
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-surface/70"
                />
                <div className="relative mx-auto flex min-h-[34rem] max-w-[1440px] items-center justify-center px-5 py-16 sm:min-h-[42rem] sm:px-8 lg:min-h-[50rem] lg:px-12">
                    <div className="w-full max-w-3xl bg-surface-alt px-6 py-10 text-center text-text sm:px-12 sm:py-14 lg:px-16 lg:py-16">
                        <h2
                            id="closing-heading"
                            className="text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl"
                        >
                            {companyContent.closing.heading}
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                            {companyContent.closing.description}
                        </p>
                        <Link
                            href="/contact"
                            className="site-button-primary mt-8 min-h-12 px-6 py-3"
                        >
                            Talk to ADM
                            <ArrowUpRight aria-hidden="true" size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
