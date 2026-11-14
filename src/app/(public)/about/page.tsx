import { connection } from "next/server";

import TeamHero from "@/components/team/TeamHero";
import TeamLeadership from "@/components/team/TeamLeadership";
import TeamFinalCTA from "@/components/team/TeamFinalCTA";
import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";
import LeadershipSection from "@/components/team/leadership";
import LeadershipOverview from "@/components/team/leadershipsecondsection";
import TeamGallery from "@/components/team/leadershipGallery";

export default async function TeamPage() {
    await connection();
    await connectDB();

    const teamMembers =
        await PublicContentService.getAllTeamMembers();

    return (
        <>
            <TeamHero />
            <LeadershipOverview/>
            <TeamGallery/>

            <LeadershipSection/>
            <TeamLeadership members={teamMembers} />
            <TeamFinalCTA />
        </>
    );
}
