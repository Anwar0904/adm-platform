"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UserRound, X } from "lucide-react";
import {
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
} from "react-icons/fa";

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

const socialLinks = [
    { key: "facebook", label: "Facebook", Icon: FaFacebookF },
    { key: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn },
    { key: "twitter", label: "Twitter", Icon: FaTwitter },
    { key: "instagram", label: "Instagram", Icon: FaInstagram },
    { key: "github", label: "GitHub", Icon: FaGithub },
] as const;

function ProfileLinks({ member }: { member: DirectoryMember }) {
    const links = socialLinks.flatMap(({ key, label, Icon }) => {
        const href = safeExternalUrl(member.socialLinks[key]);
        return href ? [{ key, label, Icon, href }] : [];
    });
    const portfolio = safeExternalUrl(member.socialLinks.website);

    if (links.length === 0 && !portfolio) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {links.map(({ key, label, Icon, href }) => (
                <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${label}`}
                    title={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    <Icon aria-hidden="true" size={16} />
                </a>
            ))}

            {portfolio && (
                <a
                    href={portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center rounded-full border border-cyan-300/30 px-4 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    View Portfolio
                </a>
            )}
        </div>
    );
}

function Portrait({
    member,
    priority = false,
}: {
    member: DirectoryMember;
    priority?: boolean;
}) {
    return member.avatar?.url ? (
        <Image
            src={member.avatar.url}
            alt={member.avatar.alt || `${member.name}, ${member.designation}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            unoptimized
            className="object-cover"
        />
    ) : (
        <div className="flex h-full items-center justify-center bg-[#0b1a2c] text-slate-500">
            <UserRound aria-hidden="true" size={56} strokeWidth={1.2} />
        </div>
    );
}

export default function LeadershipDirectory({
    groupTitle,
    members,
}: Props) {
    const [selectedMember, setSelectedMember] =
        useState<DirectoryMember | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (selectedMember && dialog && !dialog.open) {
            dialog.showModal();
        } else if (!selectedMember && dialog?.open) {
            dialog.close();
        }
    }, [selectedMember]);

    const closeProfile = () => {
        dialogRef.current?.close();
        setSelectedMember(null);
    };

    return (
        <section
            aria-label={`${groupTitle} profiles`}
            className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20"
        >
            {members.length ? (
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
                    {members.map((member, index) => {
                        const introduction =
                            member.shortBio || member.biography || "";
                        const preview =
                            introduction.length > 220
                                ? `${introduction.slice(0, 217).trimEnd()}...`
                                : introduction;

                        return (
                            <article key={member.id} className="min-w-0">
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#0b1a2c]">
                                    <Portrait
                                        member={member}
                                        priority={index < 3}
                                    />
                                </div>

                                <div className="pt-6">
                                    <p className="text-sm font-medium text-cyan-200">
                                        {member.designation}
                                    </p>
                                    <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight text-white">
                                        {member.name}
                                    </h2>
                                    {preview && (
                                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-400">
                                            {preview}
                                        </p>
                                    )}

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                                        <button
                                            type="button"
                                            aria-haspopup="dialog"
                                            onClick={() =>
                                                setSelectedMember(member)
                                            }
                                            className="text-sm font-semibold text-cyan-200 underline decoration-cyan-200/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                                        >
                                            View full profile
                                        </button>
                                        <ProfileLinks member={member} />
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <p className="py-12 text-center text-base leading-7 text-slate-400">
                    Leadership profiles will be available here soon.
                </p>
            )}

            <dialog
                ref={dialogRef}
                aria-modal="true"
                aria-labelledby={
                    selectedMember
                        ? `leadership-profile-${selectedMember.id}`
                        : undefined
                }
                onClose={() => setSelectedMember(null)}
                onCancel={() => setSelectedMember(null)}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        closeProfile();
                    }
                }}
                className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#071423] p-0 text-white shadow-2xl backdrop:bg-slate-950/80"
            >
                {selectedMember && (
                    <div className="relative grid md:grid-cols-5">
                        <div className="relative aspect-[4/3] bg-[#0b1a2c] md:col-span-2 md:aspect-auto md:min-h-[32rem]">
                            <Portrait member={selectedMember} />
                        </div>
                        <div className="p-6 sm:p-8 md:col-span-3 md:p-10">
                            <button
                                type="button"
                                onClick={closeProfile}
                                aria-label="Close profile"
                                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#071423] text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                            >
                                <X aria-hidden="true" size={18} />
                            </button>
                            <p className="pr-12 text-sm font-medium text-cyan-200">
                                {selectedMember.designation}
                            </p>
                            <h2
                                id={`leadership-profile-${selectedMember.id}`}
                                className="mt-3 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                            >
                                {selectedMember.name}
                            </h2>

                            {(selectedMember.biography ||
                                selectedMember.shortBio) && (
                                <div className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base">
                                    {selectedMember.biography ||
                                        selectedMember.shortBio}
                                </div>
                            )}

                            <div className="mt-8">
                                <ProfileLinks member={selectedMember} />
                            </div>
                        </div>
                    </div>
                )}
            </dialog>
        </section>
    );
}
