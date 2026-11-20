import type { Metadata } from "next";
import LegalPage, { legalIcons, type LegalSection } from "@/components/legal/LegalPage";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
    title: "Cookie Policy",
    description: "Understand how Arazi Digital Media uses cookies and similar technologies.",
    alternates: { canonical: `${SITE_URL}/cookies` },
};

const sections: LegalSection[] = [
    {
        id: "what-cookies-are",
        title: "What cookies are",
        paragraphs: ["Cookies are small text files saved by a website in your browser. Similar technologies can help a site remember preferences, understand usage, and keep features working reliably."],
    },
    {
        id: "how-we-use-them",
        title: "How we use them",
        paragraphs: ["ADM uses cookies and similar technologies in limited, purposeful ways."],
        bullets: [
            "Essential cookies help pages, security controls, and basic functionality work.",
            "Preference cookies remember choices that make the experience more useful.",
            "Analytics technologies help us understand aggregate traffic and improve content and performance.",
        ],
    },
    {
        id: "third-party-tools",
        title: "Third-party tools",
        paragraphs: ["Some pages may include services such as analytics, embedded content, or social links. Those providers may set their own cookies under their own policies. We do not control cookies placed by third-party websites when you follow an external link."],
    },
    {
        id: "your-controls",
        title: "Your controls",
        paragraphs: ["Most browsers let you view, block, delete, or limit cookies through their settings. Blocking essential cookies may affect how some pages work. Your browser's help documentation explains the available controls."],
    },
    {
        id: "updates",
        title: "Updates to this policy",
        paragraphs: ["We may update this page when our website, tools, or legal requirements change. The date at the top of this page indicates when it was last reviewed."],
    },
    {
        id: "contact",
        title: "Contact us",
        paragraphs: ["If you have a question about our use of cookies, use the contact form and include the relevant page or cookie setting in your message."],
    },
];

export default function CookiesPage() {
    return <LegalPage currentHref="/cookies" eyebrow="Cookie policy" title="A quieter, more useful web experience." summary="This page explains the small technologies ADM may use to keep the site reliable, remember preferences, and learn what content helps visitors most." updated="September 20, 2026" icon={legalIcons.cookies} accent="bg-amber-400/20 text-amber-200" sections={sections} />;
}
