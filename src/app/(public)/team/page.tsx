import { connection } from "next/server";

import TeamHero from "@/components/team/TeamHero";
import TeamLeadership from "@/components/team/TeamLeadership";
import TeamFinalCTA from "@/components/team/TeamFinalCTA";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";

export default async function TeamPage() {
    await connection();
    await connectDB();

    const { teamMembers } =
        await PublicContentService.getTeamMembers({
            page: 1,
            limit: 2,
        });

    return (
        <>
            <TeamHero />
            <TeamLeadership members={teamMembers} />
            <TeamFinalCTA />
        </>
    );
}
