import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const principles = [
    {
        title: "People",
        description:
            "Consider the people who shape, use and are affected by digital work.",
    },
    {
        title: "Environment",
        description:
            "Stay aware of the infrastructure, devices and energy behind digital services.",
    },
    {
        title: "Responsible technology",
        description:
            "Keep purpose, privacy, security and human context in view.",
    },
    {
        title: "Access",
        description:
            "Think about who a digital experience serves and what barriers may exist.",
    },
] as const;

const resources = [
    {
        title: "Our company",
        description:
            "Learn about Arazi Digital Media and our connected capabilities.",
        href: "/about",
        action: "Explore",
    },
    {
        title: "Talk with ADM",
        description:
            "Discuss responsible digital work with our team.",
        href: "/contact",
        action: "Contact",
    },
] as const;

export default function SustainabilityPage() {
    return (
        <div className="bg-surface text-text">
            <section
                aria-labelledby="sustainability-heading"
                className="bg-surface pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pt-28"
            >
                <div className="mx-auto max-w-[58rem] px-5 text-center sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                        Sustainability
                    </p>
                    <h1
                        id="sustainability-heading"
                        className="mt-5 text-[clamp(2.1rem,4vw,3.5rem)] font-normal uppercase leading-[1.04] tracking-[-0.05em]"
                    >
                        Responsible Digital Growth
                    </h1>
                    <p className="mx-auto mt-6 text-lg font-medium leading-7 text-text sm:text-2xl sm:leading-9">
                        Building What&apos;s Next for the Digital Economy.
                    </p>
                    <p className="mx-auto mt-5 max-w-4xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                        Arazi Digital Media is a global Technology, Marketing,
                        AI and Data company.
                    </p>
                    <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                        How digital work is designed matters alongside what it
                        delivers. We aim to consider its effects on people,
                        businesses and the wider world.
                    </p>
                </div>

                <figure className="mx-auto mt-[80px] max-w-[1440px] px-[24px] sm:mt-[80px] lg:mt-[5.25rem]">
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-alt sm:aspect-[4/3] lg:aspect-[16/9]">
                        <Image
                            src="/home/building.jpeg"
                            alt="Glass city tower surrounded by nearby buildings and trees"
                            fill
                            preload
                            sizes="(max-width: 1023px) calc(100vw - 48px), 95vw"
                            className="object-cover object-[center_42%]"
                        />
                    </div>
                </figure>
            </section>

            <section
                aria-labelledby="principles-heading"
                className="bg-surface-alt py-16 sm:py-20 lg:pb-60 lg:pt-48"
            >
                <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        <h2
                            id="principles-heading"
                            className="text-lg font-medium uppercase tracking-[0.08em] text-text sm:text-xl"
                        >
                            Principles we keep in view
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
                            These are considerations that inform our perspective,
                            not quantified targets or claims of measured impact.
                        </p>
                    </div>

                    <div className="mt-8 grid border-y border-border sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
                        {principles.map((principle) => (
                            <article
                                key={principle.title}
                                className="border-b border-border py-6 sm:px-6 sm:py-7 lg:border-b-0 lg:border-r lg:px-6 lg:py-9 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                            >
                                <h3 className="text-xl font-medium tracking-tight text-brand-300 sm:text-2xl">
                                    {principle.title}
                                </h3>
                                <p className="mt-3 max-w-xs text-sm leading-6 text-text-muted sm:text-base sm:leading-7">
                                    {principle.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="environment-heading"
                className="bg-surface py-14 sm:py-16 lg:py-6"
            >
                <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[2fr_0.85fr] lg:gap-16 lg:px-6">
                    <figure className="relative aspect-[4/3] overflow-hidden bg-surface-alt lg:aspect-[16/10]">
                        <Image
                            src="/home/laptop.jpeg"
                            alt="Laptop and digital dashboard on a shared office table"
                            fill
                            sizes="(max-width: 1023px) 100vw, 62vw"
                            className="object-cover"
                        />
                    </figure>
                    <div className="max-w-lg py-3 lg:py-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                            Environmental awareness
                        </p>
                        <h2
                            id="environment-heading"
                            className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl"
                        >
                            Digital work has a physical context.
                        </h2>
                        <p className="mt-5 text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                            Digital services depend on devices, networks and
                            energy. We aim to stay mindful of these
                            dependencies as we consider how work is designed
                            and delivered.
                        </p>
                        <Link
                            href="/about"
                            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                        >
                            Explore our company
                            <ArrowUpRight aria-hidden="true" size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="people-heading"
                className="bg-surface-alt py-14 sm:py-16 lg:py-2"
            >
                <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-6">
                    <div className="max-w-lg py-3 lg:py-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                            People &amp; society
                        </p>
                        <h2
                            id="people-heading"
                            className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl"
                        >
                            Technology is made for people.
                        </h2>
                        <p className="mt-5 text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                            We aim to consider who uses a digital experience,
                            what context should shape it and where barriers
                            might arise. Listening and thoughtful design are
                            important starting points.
                        </p>
                    </div>
                    <figure className="relative aspect-[4/3] overflow-hidden bg-surface lg:aspect-[3/2]">
                        <Image
                            src="/home/team.jpeg"
                            alt="Colleagues collaborating around a table in a bright office"
                            fill
                            sizes="(max-width: 1023px) 100vw, 58vw"
                            className="object-cover"
                        />
                    </figure>
                </div>
            </section>

            <section
                aria-labelledby="responsible-business-heading"
                className="bg-surface py-14 sm:py-16 lg:pb-0 lg:pt-20"
            >
                <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[2fr_0.85fr] lg:gap-16 lg:px-6">
                    <figure className="relative aspect-[4/3] overflow-hidden bg-surface-alt lg:aspect-[16/9]">
                        <Image
                            src="/home/building.jpeg"
                            alt="Modern glass tower in a city setting"
                            fill
                            sizes="(max-width: 1023px) 100vw, 62vw"
                            className="object-cover object-[center_56%]"
                        />
                    </figure>
                    <div className="max-w-lg py-3 lg:py-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                            Responsible business
                        </p>
                        <h2
                            id="responsible-business-heading"
                            className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl"
                        >
                            Make room for considered choices.
                        </h2>
                        <p className="mt-5 text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                            Across Technology, Marketing, AI and Data, we aim
                            to keep purpose, privacy, security, transparency
                            and human context part of the conversation as
                            technology evolves.
                        </p>
                        <Link
                            href="/contact"
                            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                        >
                            Talk to ADM
                            <ArrowUpRight aria-hidden="true" size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section
                id="resources"
                aria-labelledby="resources-heading"
                className="bg-surface-alt py-16 sm:py-20 lg:pb-24 lg:pt-2"
            >
                <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">
                            Further information
                        </p>
                        <h2
                            id="resources-heading"
                            className="mt-3 text-3xl font-medium tracking-[-0.035em] sm:text-4xl"
                        >
                            Resources
                        </h2>
                    </div>
                    <ul className="divide-y divide-border border-y border-border">
                        {resources.map((resource) => (
                            <li key={resource.href}>
                                <Link
                                    href={resource.href}
                                    className="group flex min-h-20 items-center justify-between gap-5 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
                                >
                                    <span>
                                        <span className="block font-medium text-text transition-colors group-hover:text-brand-300">
                                            {resource.title}
                                        </span>
                                        <span className="mt-1 block text-sm leading-6 text-text-muted">
                                            {resource.description}
                                        </span>
                                    </span>
                                    <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-300">
                                        {resource.action}
                                        <ArrowUpRight
                                            aria-hidden="true"
                                            size={16}
                                        />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section
                aria-labelledby="sustainability-close-heading"
                className="relative isolate min-h-[64rem] overflow-hidden bg-surface sm:min-h-[68rem] lg:min-h-[70rem]"
            >
                <Image
                    src="/about/company-media-poster.svg"
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-surface/20"
                />
                <div className="relative mx-auto flex min-h-[64rem] max-w-[1440px] items-end justify-center px-5 pb-20 sm:min-h-[68rem] sm:px-8 sm:pb-24 lg:min-h-[70rem] lg:px-12 lg:pb-32">
                    <div className="w-full max-w-3xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                            Arazi Digital Media
                        </p>
                        <h2
                            id="sustainability-close-heading"
                            className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl"
                        >
                            Building what&apos;s next, thoughtfully.
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
                            Responsible digital progress begins with the
                            purpose behind the work and the people it serves.
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
