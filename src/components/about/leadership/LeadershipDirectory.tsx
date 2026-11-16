"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Globe2, UserRound } from "lucide-react";
import {
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import type { IPublicTeamMember } from "@/types/team-member.types";

type DirectoryMember = Pick<
    IPublicTeamMember,
    | "id"
    | "name"
    | "designation"
    | "shortBio"
    | "biography"
    | "avatar"
    | "socialLinks"
>;

type Props = {
    groupTitle: string;
    members: DirectoryMember[];
};

function safeExternalUrl(value?: string) {
    if (typeof value !== "string" || !value.trim()) {
        return undefined;
    }

    try {
        const url = new URL(value.trim());
        return url.protocol === "https:" || url.protocol === "http:"
            ? url.href
            : undefined;
    } catch {
        return undefined;
    }
}

function safeImageSource(value?: string) {
    if (typeof value !== "string" || !value.trim()) {
        return undefined;
    }

    const source = value.trim();
    if (source.startsWith("/") && !source.startsWith("//")) {
        return source;
    }

    return safeExternalUrl(source);
}

const socialPlatforms = [
    { key: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn },
    { key: "github", label: "GitHub", Icon: FaGithub },
    { key: "facebook", label: "Facebook", Icon: FaFacebookF },
    { key: "instagram", label: "Instagram", Icon: FaInstagram },
    { key: "twitter", label: "X", Icon: FaXTwitter },
] as const;

function ProfileLinks({ member }: { member: DirectoryMember }) {
    const links = socialPlatforms.flatMap(({ key, label, Icon }) => {
        const href = safeExternalUrl(member.socialLinks[key]);
        return href ? [{ key, label, Icon, href }] : [];
    });
    const website = safeExternalUrl(member.socialLinks.website);

    if (links.length === 0 && !website) {
        return null;
    }

    return (
        <div
            role="group"
            aria-label={`${member.name} links`}
            className="flex flex-wrap items-center gap-2"
        >
            {links.map(({ key, label, Icon, href }) => (
                <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${label}`}
                    title={`${label} profile`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    <Icon aria-hidden="true" size={16} />
                </a>
            ))}

            {website && (
                <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name}'s website`}
                    title="Website"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    <Globe2 aria-hidden="true" size={16} />
                </a>
            )}
        </div>
    );
}

function Portrait({ member }: { member: DirectoryMember }) {
    const source = safeImageSource(member.avatar?.url);
    const [failedSource, setFailedSource] = useState<string>();

    return (
        <div className="relative aspect-[4/4.6] overflow-hidden bg-[#0b1a2c]">
            {source && source !== failedSource ? (
                <Image
                    src={source}
                    alt={
                        member.avatar?.alt?.trim() ||
                        `${member.name}, ${member.designation}`
                    }
                    fill
                    sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1280px) 38vw, 430px"
                    unoptimized
                    onError={() => setFailedSource(source)}
                    className="object-cover"
                />
            ) : (
                <div
                    aria-hidden="true"
                    className="flex h-full items-center justify-center text-slate-500"
                >
                    <UserRound size={52} strokeWidth={1.2} />
                </div>
            )}
        </div>
    );
}

function biographyText(value?: string) {
    return value?.trim() ?? "";
}

function previewFromBiography(biography: string) {
    if (biography.length <= 240) {
        return biography;
    }

    const excerpt = biography.slice(0, 240);
    const wordBoundary = excerpt.lastIndexOf(" ");
    const end = wordBoundary > 180 ? wordBoundary : excerpt.length;
    return `${excerpt.slice(0, end).trimEnd()}…`;
}

function comparableText(value: string) {
    return value.trim().replace(/\s+/g, " ");
}

function Biography({ member }: { member: DirectoryMember }) {
    const shortBio = biographyText(member.shortBio);
    const fullBio = biographyText(member.biography) || shortBio;
    const preview = shortBio || previewFromBiography(fullBio);
    const canExpand =
        Boolean(fullBio) &&
        comparableText(fullBio) !== comparableText(preview);
    const [expanded, setExpanded] = useState(false);
    const biographyId = `leadership-biography-${member.id}`;

    if (!preview) {
        return null;
    }

    return (
        <div className="mt-5">
            <p
                className={`whitespace-pre-line text-base leading-7 text-slate-300 ${
                    expanded ? "hidden" : ""
                }`}
            >
                {preview}
            </p>
            {canExpand && (
                <div
                    id={biographyId}
                    aria-hidden={!expanded}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                        expanded
                            ? "mt-2 grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                    }`}
                >
                    <div className="min-h-0 overflow-hidden">
                        <p className="whitespace-pre-line text-base leading-7 text-slate-300">
                            {fullBio}
                        </p>
                    </div>
                </div>
            )}
            {canExpand && (
                <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={biographyId}
                    onClick={() => setExpanded((current) => !current)}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-cyan-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    {expanded ? "Show less" : "Read full biography"}
                    <ChevronDown
                        aria-hidden="true"
                        size={16}
                        className={`transition-transform duration-200 motion-reduce:transition-none ${
                            expanded ? "rotate-180" : ""
                        }`}
                    />
                </button>
            )}
        </div>
    );
}

function LeadershipMemberRow({ member }: { member: DirectoryMember }) {
    return (
        <li className="border-t border-white/[0.08] py-9 first:border-t-0 first:pt-0 sm:py-12 sm:first:pt-0">
            <article className="grid items-start gap-6 md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] md:gap-10 lg:gap-14">
                <Portrait member={member} />

                <div className="flex min-w-0 flex-col justify-center md:py-4">
                    <h2 className="break-words text-2xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl">
                        {member.name}
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-brand-200 sm:text-base">
                        {member.designation}
                    </p>

                    <Biography member={member} />

                    <div className="mt-6">
                        <ProfileLinks member={member} />
                    </div>
                </div>
            </article>
        </li>
    );
}

export default function LeadershipDirectory({
    groupTitle,
    members,
}: Props) {
    return (
        <section
            aria-label={`${groupTitle} profiles`}
            className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16"
        >
            {members.length ? (
                <ul>
                    {members.map((member) => (
                        <LeadershipMemberRow key={member.id} member={member} />
                    ))}
                </ul>
            ) : (
                <p className="border-t border-white/[0.08] py-10 text-base leading-7 text-slate-400">
                    No profiles are currently available in this section.
                </p>
            )}
        </section>
    );
}
