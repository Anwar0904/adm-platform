import type { Metadata } from "next";
import { connection } from "next/server";

import CareersPage from "@/components/careers/CareersPage";
import { CAREERS_CANONICAL_URL } from "@/config/site";
import CareerService from "@/services/career.service";

export const metadata: Metadata = {
  title: { absolute: "Careers at ADM | Build What's Next for the Digital Economy" },
  description:
    "Explore careers at Arazi Digital Media. Discover our work across technology, marketing, AI and data, and find genuine opportunities to work with ADM.",
  alternates: {
    canonical: CAREERS_CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CAREERS_CANONICAL_URL,
    title: "Careers at ADM | Build What's Next for the Digital Economy",
    description:
      "Explore careers at Arazi Digital Media and discover our work across technology, marketing, AI and data.",
    siteName: "Arazi Digital Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at ADM | Build What's Next for the Digital Economy",
    description:
      "Explore careers at Arazi Digital Media and discover our work across technology, marketing, AI and data.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function CareersRoute() {
  await connection();
  const careers = await CareerService.getPublicCareers();

  return <CareersPage careers={careers} />;
}
