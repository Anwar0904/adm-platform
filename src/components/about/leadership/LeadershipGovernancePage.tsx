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
                <div className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-10">
                    <div className="mt-9 max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                            Leadership &amp; Governance
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
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
