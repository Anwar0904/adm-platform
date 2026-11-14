"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";

import type { IPublicTeamMember } from "@/types/team-member.types";

export default function LeadershipSection({
    members,
}: {
    members: IPublicTeamMember[];
}) {
    return (
        <section
            id="leadership-board"
            aria-labelledby="leadership-board-heading"
            className="relative overflow-hidden bg-slate-950 py-24"
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb08,transparent_35%),radial-gradient(circle_at_bottom_left,#38bdf808,transparent_35%)]"
            />

            <div className="container relative mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-16 max-w-3xl text-center sm:mb-20"
                >
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-200">
                        Board
                    </span>

                    <h2
                        id="leadership-board-heading"
                        className="mt-6 text-3xl font-black text-white sm:text-4xl lg:text-5xl"
                    >
                        Board of Arazi Digital Media
                    </h2>

                    <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
                        Board profiles are published only after each person&apos;s
                        identity, designation, biography and appointment have
                        been approved.
                    </p>
                </motion.div>

                {members.length > 0 ? (
                    <div className="space-y-16">
                        {members.map((member, index) => {
                            const biography = member.biography || member.shortBio;

                            return (
                                <motion.article
                                    key={member.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.12 }}
                                    className={`grid items-center gap-10 lg:grid-cols-2 ${
                                        index % 2 === 1
                                            ? "lg:[&>*:first-child]:order-2"
                                            : ""
                                    }`}
                                >
                                    <div className="group relative overflow-hidden rounded-[34px]">
                                        {member.avatar?.url ? (
                                            <Image
                                                src={member.avatar.url}
                                                alt={
                                                    member.avatar.alt ||
                                                    `${member.name}, ${member.designation}`
                                                }
                                                width={900}
                                                height={900}
                                                className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[520px] lg:h-[650px]"
                                            />
                                        ) : (
                                            <div className="flex h-[420px] flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-400 sm:h-[520px] lg:h-[650px]">
                                                <UserRound
                                                    aria-hidden="true"
                                                    size={56}
                                                    strokeWidth={1.2}
                                                />
                                                <span className="mt-4 text-xs font-semibold uppercase tracking-[0.18em]">
                                                    Portrait not provided
                                                </span>
                                            </div>
                                        )}
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent"
                                        />
                                    </div>

                                    <div>
                                        <span className="font-semibold uppercase tracking-[0.3em] text-blue-300">
                                            {member.designation}
                                        </span>

                                        <h3 className="mt-5 text-4xl font-black text-white sm:text-5xl">
                                            {member.name}
                                        </h3>

                                        {biography && (
                                            <p className="mt-8 text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
                                                {biography}
                                            </p>
                                        )}

                                        {member.skills.length > 0 && (
                                            <ul className="mt-10 flex flex-wrap gap-3">
                                                {member.skills.map((skill) => (
                                                    <li
                                                        key={skill.name}
                                                        className="rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200"
                                                    >
                                                        {skill.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-10 text-center sm:px-10">
                        <p className="text-lg font-semibold text-white">
                            Board profiles will appear here after official
                            records are assigned.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
