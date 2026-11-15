import Link from "next/link";
import { connection } from "next/server";

import LeadershipDirectory from "@/components/about/leadership/LeadershipDirectory";
import LeadershipDataError from "@/components/about/leadership/LeadershipDataError";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";
import type {
    IPublicTeamMember,
    TeamGovernanceGroup,
} from "@/types/team-member.types";

type Props = {
    group: TeamGovernanceGroup;
    title: string;
    description: string;
};

const governancePaths: Record<TeamGovernanceGroup, string> = {
    board: "leadership-board",
    executive: "executive-committee",
    management: "management-committee",
};

export default async function LeadershipGovernancePage({
    group,
    title,
    description,
}: Props) {
    await connection();

    let teamMembers: IPublicTeamMember[] | undefined;
    let databaseUnavailable = false;

    try {
        await connectDB();
        ({ teamMembers } = await PublicContentService.getTeamMembers({
            page: 1,
            limit: 100,
            governanceGroup: group,
        }));
    } catch (error) {
        const isDatabaseUnavailable =
            typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            error.statusCode === 503;

        if (!isDatabaseUnavailable) {
            throw error;
        }

        console.error(
            `Unable to load ${title} profiles (database unavailable).`
        );
        databaseUnavailable = true;
    }

    return (
        <main className="min-h-screen bg-[#050d1a]">
            <section className="border-b border-white/[0.06]">
                <div className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pb-16 lg:px-10">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-400">
                            <li>
                                <Link
                                    href="/"
                                    className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                >
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li>
                                <Link
                                    href="/about"
                                    className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                >
                                    About
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li>
                                <Link
                                    href="/about/leadership-governance"
                                    className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                >
                                    Leadership Governance
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li aria-current="page" className="text-white">
                                {title}
                            </li>
                        </ol>
                    </nav>

                    <div className="mt-10 max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                            Leadership &amp; Governance
                        </p>
                        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                            {description}
                        </p>
                    </div>
                </div>
            </section>

            {databaseUnavailable ? (
                <LeadershipDataError
                    retryHref={`/about/leadership-governance/${governancePaths[group]}`}
                />
            ) : (
                <LeadershipDirectory
                    groupTitle={title}
                    members={(teamMembers ?? []).map(
                        ({
                            id,
                            name,
                            designation,
                            shortBio,
                            biography,
                            avatar,
                            socialLinks,
                        }) => ({
                            id,
                            name,
                            designation,
                            shortBio,
                            biography,
                            avatar,
                            socialLinks,
                        })
                    )}
                />
            )}
        </main>
    );
}
