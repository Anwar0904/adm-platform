import type { Metadata } from "next";

import CompanyOverview from "@/components/about/CompanyOverview";

export const metadata: Metadata = {
    title: "Our Company",
    description:
        "Arazi Digital Media is a global Technology, Marketing, AI and Data company.",
    openGraph: {
        title: "Our Company",
        description:
            "Explore Arazi Digital Media's connected Technology, Marketing, AI and Data capabilities.",
    },
};

export default function AboutPage() {
    return <CompanyOverview />;
}
