import Image from "next/image";
import {
    ArrowDownToLine,
    ArrowUpRight,
    Globe2,
    UserRound,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import type { IPublicTeamMember } from "@/types/team-member.types";

type Props = {
    members: IPublicTeamMember[];
};

function isSafeExternalUrl(value?: string) {
    if (!value) {
        return false;
    }

    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

function isSafeCvUrl(value?: string) {
    return (
        isSafeExternalUrl(value) ||
        Boolean(value && /^\/uploads\/media\/[A-Za-z0-9._-]+$/.test(value))
    );
}

function getSectionTitle(designation: string) {
    if (/\b(founder|ceo|chief executive|owner)\b/i.test(designation)) {
        return "Executive leadership";
    }

    if (/\b(project manager|engineer|technical|developer|technology)\b/i.test(designation)) {
        return "Technical leadership";
    }

    return "Leadership profile";
}

function ProfileLinks({ member }: { member: IPublicTeamMember }) {
    const links = [
        {
            label: "LinkedIn",
            href: member.socialLinks.linkedin,
            icon: FaLinkedinIn,
        },
        {
            label: "GitHub",
            href: member.socialLinks.github,
            icon: FaGithub,
        },
        {
            label: member.socialLinks.website ? "Website / portfolio" : "",
            href: member.socialLinks.website,
            icon: Globe2,
        },
    ].filter((link) => link.label && isSafeExternalUrl(link.href));

    return (
        <div className="mt-8 flex flex-wrap gap-3">
            {links.map(({ label, href, icon: Icon }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-brand-300/40 hover:bg-brand-500/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    <Icon aria-hidden="true" size={16} />
                    {label}
                    <ArrowUpRight aria-hidden="true" size={14} className="text-slate-500" />
                </a>
            ))}

            {isSafeCvUrl(member.cvUrl) && (
                <a
                    href={member.cvUrl}
                    download
                    target={member.cvUrl?.startsWith("/") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    <ArrowDownToLine aria-hidden="true" size={16} />
                    Download CV
                </a>
            )}
        </div>
    );
}

function LeadershipProfile({
    member,
    sectionTitle,
    index,
}: {
    member: IPublicTeamMember;
    sectionTitle: string;
    index: number;
}) {
    const reverse = index % 2 === 1;
    const biography = member.biography || member.shortBio;

    return (
        <article
            className={`grid items-center gap-9 lg:grid-cols-2 lg:gap-16 ${
                reverse ? "lg:[&>div:first-child]:order-2" : ""
            }`}
        >
            <div className="relative">
                <div
                    aria-hidden="true"
                    className={`absolute -inset-3 rounded-[2rem] border border-white/[0.06] ${
                        reverse ? "-rotate-2" : "rotate-2"
                    }`}
                />
                <div className="relative aspect-[4/4.35] overflow-hidden rounded-[1.7rem] border border-white/10 bg-surface-alt shadow-soft">
                    {member.avatar?.url ? (
                        <Image
                            src={member.avatar.url}
                            alt={member.avatar.alt || `${member.name}, ${member.designation}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 48vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,rgba(43,124,255,0.19),transparent_48%),linear-gradient(145deg,#0f223a,#071423)] text-brand-200">
                            <UserRound aria-hidden="true" size={54} strokeWidth={1.2} />
                            <span className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                Portrait coming soon
                            </span>
                        </div>
                    )}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/40 to-transparent"
                    />
                </div>
            </div>

            <div className="py-2">
                <p className="text-label text-cyan-200">{sectionTitle}</p>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {member.name}
                </h2>
                <p className="mt-3 text-lg font-medium text-brand-200 sm:text-xl">
                    {member.designation}
                </p>

                {biography && (
                    <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-8 text-slate-300">
                        {biography}
                    </p>
                )}

                {member.skills.length > 0 && (
                    <div className="mt-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Areas of expertise
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2.5">
                            {member.skills.map((skill) => (
                                <li
                                    key={skill.name}
                                    className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-sm text-slate-200"
                                >
                                    {skill.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <ProfileLinks member={member} />
            </div>
        </article>
    );
}

export default function TeamLeadership({ members }: Props) {
    return (
        <section
            id="leadership"
            aria-labelledby="leadership-heading"
            className="scroll-mt-24 bg-[#050d1a] py-20 sm:py-24 lg:py-28"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="mb-14 max-w-2xl sm:mb-20">
                    <p className="text-label">Leadership at ADM</p>
                    <h2
                        id="leadership-heading"
                        className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                    >
                        Direction shaped by people.
                    </h2>
                    <p className="mt-4 max-w-xl leading-7 text-slate-400">
                        Meet the leaders guiding our strategy and the engineering behind the products we build.
                    </p>
                </div>

                {members.length > 0 ? (
                    <div className="space-y-20 sm:space-y-28">
                        {members.map((member, index) => (
                            <LeadershipProfile
                                key={member.id}
                                member={member}
                                index={index}
                                sectionTitle={getSectionTitle(member.designation)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-10 text-center sm:px-10">
                        <p className="text-lg font-medium text-white">
                            Leadership profiles are not published yet.
                        </p>
                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
                            Published team profiles will appear here as soon as they are available.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
