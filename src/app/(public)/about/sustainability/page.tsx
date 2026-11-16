import type { Metadata } from "next";

import SustainabilityPage from "@/components/sustainability/SustainabilityPage";

const description =
    "Explore Arazi Digital Media's perspective on responsible technology, people, environmental awareness and continuous improvement.";

export const metadata: Metadata = {
    title: "Sustainability",
    description,
    alternates: {
        canonical: "/about/sustainability",
    },
    openGraph: {
        title: "Sustainability | Arazi Digital Media",
        description,
        url: "/about/sustainability",
    },
};

export default function SustainabilityRoute() {
    return <SustainabilityPage />;
}
