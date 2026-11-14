import type { Metadata } from "next";
import { connection } from "next/server";

import LeadershipSection from "@/components/team/leadership";
import TeamFinalCTA from "@/components/team/TeamFinalCTA";
import TeamHero from "@/components/team/TeamHero";
import TeamLeadership from "@/components/team/TeamLeadership";
import TeamGallery from "@/components/team/leadershipGallery";
import LeadershipOverview from "@/components/team/leadershipsecondsection";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";

export const metadata: Metadata = {
    title: "Leadership & Governance",
    description:
        "Learn about the governance structure of Arazi Digital Media and view leadership profiles when their details are approved.",
    openGraph: {
        title: "Leadership & Governance | Arazi Digital Media",
        description:
            "Governance information and approved leadership profiles for Arazi Digital Media.",
    },
};

export default async function LeadershipGovernancePage() {
    await connection();
    await connectDB();

    const { teamMembers } = await PublicContentService.getTeamMembers({
        page: 1,
        limit: 100,
    });
    const assignedMembers = teamMembers.filter(
        (member) => member.governanceGroup
    );

    return (
        <>
            <TeamHero />
            <LeadershipOverview />
            <LeadershipSection
                members={assignedMembers.filter(
                    (member) => member.governanceGroup === "board"
                )}
            />
            <TeamGallery members={assignedMembers} />
            <TeamLeadership members={assignedMembers} />
            <TeamFinalCTA />
        </>
    );
}
