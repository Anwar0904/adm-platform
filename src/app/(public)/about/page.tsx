import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";

import CompanyOverview from "@/components/about/CompanyOverview";

export const metadata: Metadata = {
    title: "Our Company",
    description:
        "Arazi Digital Media brings together Technology, Marketing, AI and Data as connected capabilities.",
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
        title: "Our Company",
        description:
            "Explore Arazi Digital Media's connected Technology, Marketing, AI and Data capabilities.",
        url: `${SITE_URL}/about`,
    },
};

export default function AboutPage() {
    return <CompanyOverview />;
}
