import type { Metadata } from "next";

import LeadershipGovernancePage from "@/components/about/leadership/LeadershipGovernancePage";

const title = "Executive Committee";
const path = "/about/leadership-governance/executive-committee";
const description =
    "View the published profiles assigned to the Executive Committee of Arazi Digital Media.";

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

export default function ExecutiveCommitteePage() {
    return (
        <LeadershipGovernancePage
            group="executive"
            title={title}
            description={description}
        />
    );
}
