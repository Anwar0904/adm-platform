import type { Metadata } from "next";

import LeadershipGovernancePage from "@/components/about/leadership/LeadershipGovernancePage";

const title = "Management Committee";
const path = "/about/leadership-governance/management-committee";
const description =
    "View the published profiles assigned to the Management Committee of Arazi Digital Media.";

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

export default function ManagementCommitteePage() {
    return (
        <LeadershipGovernancePage
            group="management"
            title={title}
            description={description}
        />
    );
}
