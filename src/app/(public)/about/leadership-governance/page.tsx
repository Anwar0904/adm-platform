import type { Metadata } from "next";
import { connection } from "next/server";

import TeamFinalCTA from "@/components/team/TeamFinalCTA";
import TeamGallery from "@/components/team/leadershipGallery";
import LeadershipOverview from "@/components/team/leadershipsecondsection";
import LeadershipDataError from "@/components/about/leadership/LeadershipDataError";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";
import LeadershipHero from "@/components/about/leadership/LeadershipHero";
import type { IPublicTeamMember } from "@/types/team-member.types";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
    title: "Leadership & Governance",
    description:
        "Learn about the governance structure of Arazi Digital Media and view leadership profiles when their details are approved.",
    alternates: { canonical: `${SITE_URL}/about/leadership-governance` },
    openGraph: {
        title: "Leadership & Governance | Arazi Digital Media",
        description:
            "Governance information and approved leadership profiles for Arazi Digital Media.",
        url: `${SITE_URL}/about/leadership-governance`,
    },
};

export default async function LeadershipGovernancePage() {
    await connection();

    let assignedMembers: IPublicTeamMember[] | undefined;
    let databaseUnavailable = false;

    try {
        await connectDB();
        const { teamMembers } =
            await PublicContentService.getTeamMembers({
                page: 1,
                limit: 100,
            });
        assignedMembers = teamMembers.filter(
            (member) => member.governanceGroup
        );
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
            "Unable to load leadership overview profiles (database unavailable)."
        );
        databaseUnavailable = true;
    }

    return (
        <>
            <LeadershipHero />
            <LeadershipOverview />
            {databaseUnavailable ? (
                <LeadershipDataError retryHref="/about/leadership-governance" />
            ) : (
                <TeamGallery
                    members={(assignedMembers ?? []).map(
                        ({ id, name, designation, avatar }) => ({
                            id,
                            name,
                            designation,
                            avatar,
                        })
                    )}
                />
            )}
            <TeamFinalCTA />
        </>
    );
}
