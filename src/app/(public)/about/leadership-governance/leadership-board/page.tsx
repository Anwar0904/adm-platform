import type { Metadata } from "next";

import LeadershipGovernancePage from "@/components/about/leadership/LeadershipGovernancePage";

const title = "Board of Arazi Digital Media";
const path = "/about/leadership-governance/leadership-board";
const description =
    "View the published profiles assigned to the Board of Arazi Digital Media.";

export const metadata: Metadata = {
    title: { absolute: `${title} | Arazi Digital Media` },
    description,
    alternates: {
        canonical: path,
    },
    openGraph: {
        title: `${title} | Arazi Digital Media`,
        description,
        url: path,
    },
};

export default function LeadershipBoardPage() {
    return (
        <LeadershipGovernancePage
            group="board"
            title={title}
            description={description}
        />
    );
}
